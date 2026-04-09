# NumPals — Parent Account & Subscription Technical Spec

## Overview

Parents create an Amplify Auth account (email/password), then complete a $14.99/year Stripe Checkout session. The app gates access based on subscription status stored in Amplify Data, kept in sync via Stripe webhooks.

---

## 1. Amplify Auth Configuration

**File:** `amplify/auth/resource.ts`

```ts
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: { required: false, mutable: true },  // parent's display name
  },
});
```

**Flow:**
- Email + password signup (Amplify Authenticator component)
- Email verification via 6-digit code (Amplify default)
- `preferredUsername` stores the parent's name (optional at signup, editable later)
- No social/OAuth — keep it simple for V1

**Frontend component:** Use `@aws-amplify/ui-react` `<Authenticator>` wrapper with custom `formFields` to add a "Your Name" field.

---

## 2. Signup → Stripe Checkout Flow

**Recommended approach: Account first, then payment.**

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌──────────┐
│  Landing     │───>│  Amplify Signup   │───>│  Stripe Checkout │───>│  App     │
│  /           │    │  (email+password) │    │  ($14.99/year)   │    │  /app/   │
└─────────────┘    └──────────────────┘    └─────────────────┘    └──────────┘
                          │                        │
                     Creates Cognito           Creates Stripe
                     user record               Customer + Sub
                          │                        │
                          └──── linked by ─────────┘
                            Cognito userId = 
                            Stripe metadata.userId
```

### Why account-first:
1. Cognito `userId` is available to attach as `client_reference_id` on the Checkout session
2. If payment fails, the user still has an account and can retry from a "Complete subscription" screen
3. Stripe Checkout handles PCI compliance — no card data touches our code
4. Simpler error handling: auth errors and payment errors are separate steps

### Step-by-step:

1. **User lands on `/app/`** → sees `<Authenticator>` (sign up / sign in)
2. **User signs up** → Amplify creates Cognito user, sends verification email
3. **User verifies email** → signed in, but `subscriptionStatus` in Data model = `'none'`
4. **App detects no active subscription** → shows "Subscribe" screen with plan details
5. **User clicks "Subscribe — $14.99/year"** → frontend calls a custom query/mutation that creates a Stripe Checkout Session (via Amplify Function) and returns the session URL
6. **User is redirected to Stripe Checkout** → completes payment
7. **Stripe redirects to `/app/?session_id={CHECKOUT_SESSION_ID}`** → app shows "Activating..." spinner
8. **Stripe fires `checkout.session.completed` webhook** → Lambda updates Amplify Data model
9. **App polls or re-fetches subscription status** → subscription active, full access granted

---

## 3. Amplify Data Model

**File:** `amplify/data/resource.ts`

Replace the placeholder Todo model with:

```ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Subscription: a
    .model({
      userId: a.string().required(),           // Cognito sub (userId)
      stripeCustomerId: a.string(),            // cus_xxx
      stripeSubscriptionId: a.string(),        // sub_xxx
      status: a.enum(['none', 'active', 'past_due', 'canceled', 'trialing']),
      currentPeriodEnd: a.datetime(),          // When the current billing period ends
      plan: a.string(),                        // 'yearly_1499'
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(['userId'])
    .authorization((allow) => [
      allow.owner().to(['read']),              // Parents can read their own
      allow.group('ADMIN').to(['create', 'read', 'update', 'delete']),
    ]),

  ChildProfile: a
    .model({
      userId: a.string().required(),           // Parent's Cognito sub
      name: a.string().required(),
      avatar: a.string().required(),           // CharacterName
      conceptProgress: a.json(),               // Serialized Record<SubConcept, SubConceptProgress>
      accuracyHistory: a.json(),               // Serialized array
      recentActivity: a.json(),                // Serialized array
    })
    .secondaryIndexes((index) => [
      index('userId'),
    ])
    .authorization((allow) => [
      allow.owner(),                           // Full CRUD for the parent who created it
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",      // Switch from apiKey to Cognito
  },
});
```

**Key decisions:**
- `Subscription` keyed by `userId` (1:1 with Cognito user) — no need for a separate `id`
- `status` enum mirrors Stripe subscription statuses
- `ChildProfile` stores the same data currently in localStorage, enabling cloud sync
- Authorization: owners can read their subscription; only backend (ADMIN group or Lambda with IAM) can write subscription records (prevents client-side tampering)
- `conceptProgress`, `accuracyHistory`, `recentActivity` stored as JSON to avoid deeply nested GraphQL schemas

---

## 4. Stripe Checkout Session Creation

**New Amplify Function:** `amplify/functions/create-checkout-session/`

```ts
// amplify/functions/create-checkout-session/handler.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const handler = async (event: any) => {
  const userId = event.identity?.sub;  // From Cognito JWT
  if (!userId) return { statusCode: 401, body: 'Unauthorized' };

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.STRIPE_PRICE_ID!,   // price_xxx for $14.99/year
      quantity: 1,
    }],
    client_reference_id: userId,               // Links Stripe ↔ Cognito
    success_url: `${process.env.APP_URL}/app/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/app/?checkout=canceled`,
    metadata: { userId },
  });

  return { sessionUrl: session.url };
};
```

**Wire it up as a custom query in the Data schema:**

```ts
// Add to schema definition:
createCheckoutSession: a
  .query()
  .returns(a.customType({ sessionUrl: a.string() }))
  .handler(a.handler.function(createCheckoutSession))
  .authorization((allow) => [allow.authenticated()]),
```

**Environment variables** (set in Amplify console or `amplify/backend.ts`):
- `STRIPE_SECRET_KEY` — Stripe secret key (use SSM Parameter Store via `secret()`)
- `STRIPE_PRICE_ID` — The Price ID for the $14.99/year plan
- `APP_URL` — `https://numpals.com` (or dev equivalent)

---

## 5. Stripe Webhook Endpoint

**New Amplify Function:** `amplify/functions/stripe-webhook/`

**Strategy: Lambda Function URL** (not API Gateway — simpler, no extra infra)

```ts
// amplify/functions/stripe-webhook/handler.ts
import Stripe from 'stripe';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export const handler = async (event: any) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, WEBHOOK_SECRET);
  } catch {
    return { statusCode: 400, body: 'Invalid signature' };
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id!;
      const subscriptionId = session.subscription as string;

      // Fetch full subscription details
      const sub = await stripe.subscriptions.retrieve(subscriptionId);

      // Upsert Subscription record in Amplify Data
      await upsertSubscription({
        userId,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: subscriptionId,
        status: 'active',
        currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
        plan: 'yearly_1499',
      });
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = stripeEvent.data.object as Stripe.Subscription;
      const userId = sub.metadata.userId;

      await upsertSubscription({
        userId,
        status: sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : 'canceled',
        currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
        stripeSubscriptionId: sub.id,
        stripeCustomerId: sub.customer as string,
        plan: 'yearly_1499',
      });
      break;
    }
  }

  return { statusCode: 200, body: 'ok' };
};
```

**Webhook events to register in Stripe Dashboard:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed` (optional — to set `past_due`)

**Lambda Function URL setup** in `amplify/backend.ts`:

```ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { stripeWebhook } from './functions/stripe-webhook/resource';
import { createCheckoutSession } from './functions/create-checkout-session/resource';

const backend = defineBackend({
  auth,
  data,
  stripeWebhook,
  createCheckoutSession,
});

// Expose stripe webhook as a Function URL (public, Stripe signs requests)
const webhookFn = backend.stripeWebhook.resources.lambda;
webhookFn.addFunctionUrl({
  authType: 'NONE',  // Stripe signs with webhook secret, not IAM
});
```

---

## 6. Frontend Subscription Gating

### Hook: `useSubscription.ts`

```ts
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export function useSubscription() {
  const { user } = useAuthenticator();
  const [status, setStatus] = useState<'loading' | 'active' | 'none' | 'past_due' | 'canceled'>('loading');

  useEffect(() => {
    if (!user) return;
    
    client.models.Subscription.get({ userId: user.userId })
      .then(({ data }) => {
        if (!data || data.status !== 'active') {
          setStatus(data?.status ?? 'none');
        } else {
          setStatus('active');
        }
      })
      .catch(() => setStatus('none'));
  }, [user]);

  return { status, isActive: status === 'active' };
}
```

### App.tsx gating pattern:

```tsx
function App() {
  const { status, isActive } = useSubscription();

  if (status === 'loading') return <LoadingScreen />;
  if (!isActive) return <SubscribeScreen status={status} />;
  
  // Full app access
  return <MainApp />;
}
```

### SubscribeScreen component:
- Shows plan details ($14.99/year, what's included)
- "Subscribe" button calls `createCheckoutSession` query → redirects to Stripe
- If `status === 'past_due'`, show "Update payment method" messaging
- If `status === 'canceled'`, show "Resubscribe" option
- After returning from Stripe (`?checkout=success`), poll subscription status for up to 10s (webhook may take a moment)

---

## 7. Stripe Setup Checklist (for Engineer)

1. **Create Stripe account** at stripe.com
2. **Create Product**: "NumPals Yearly" → Price: $14.99/year, recurring
3. **Copy Price ID** (`price_xxx`) → set as env var `STRIPE_PRICE_ID`
4. **Get API keys** → `STRIPE_SECRET_KEY` (store in AWS SSM/Secrets Manager, reference via Amplify `secret()`)
5. **Install `stripe` npm package** in `amplify/functions/*/package.json`
6. **After deploying**: Register webhook endpoint (Lambda Function URL) in Stripe Dashboard
7. **Copy Webhook Signing Secret** → set as env var `STRIPE_WEBHOOK_SECRET`
8. **Test with Stripe CLI**: `stripe listen --forward-to <function-url>`

---

## 8. Security Considerations

- **Never expose Stripe secret key to frontend** — all Stripe API calls happen in Lambda
- **Webhook signature verification** — always validate `stripe-signature` header
- **Subscription writes are backend-only** — frontend can only read, not write subscription status
- **Cognito userId** links all records — no user-supplied IDs trusted
- **HTTPS only** — Lambda Function URLs are HTTPS by default

---

## 9. Migration Strategy (localStorage → Cloud)

Since child profiles currently live in localStorage:

1. **Phase 1 (this spec):** Auth + subscription gating. Child profiles remain in localStorage.
2. **Phase 2:** After signup, offer "Sync profiles to cloud" — read localStorage, write to `ChildProfile` model via Amplify Data.
3. **Phase 3:** Default to cloud storage; localStorage as offline fallback.

This avoids blocking the subscription launch on a full data migration.

---

## 10. File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `amplify/auth/resource.ts` | Edit | Add `userAttributes.preferredUsername` |
| `amplify/data/resource.ts` | Rewrite | Replace Todo with Subscription + ChildProfile models, switch to userPool auth |
| `amplify/backend.ts` | Edit | Add function references, configure Function URL |
| `amplify/functions/create-checkout-session/` | Create | Stripe Checkout session Lambda |
| `amplify/functions/stripe-webhook/` | Create | Webhook handler Lambda |
| `src/hooks/useSubscription.ts` | Create | Subscription status hook |
| `src/components/SubscribeScreen.tsx` | Create | Payment gate UI |
| `src/App.tsx` | Edit | Wrap in `<Authenticator>`, add subscription gate |
| `package.json` | Edit | Add `stripe` to backend function deps |
