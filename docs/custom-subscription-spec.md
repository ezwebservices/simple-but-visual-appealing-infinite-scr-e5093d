# NumPals — Custom In-App Subscription Flow (Stripe Elements)

## Overview

Replace the current Stripe Payment Link redirect (`VITE_STRIPE_CHECKOUT_URL`) in `SubscriptionGate.tsx` with an embedded payment form using `@stripe/react-stripe-js` and the Stripe `PaymentElement`. Users complete payment without leaving the app.

This spec supersedes the Checkout-redirect approach in `docs/auth-subscription-spec.md` (sections 2, 4, and 6).

---

## 1. Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│  Frontend (React / Vite)                                             │
│                                                                      │
│  SubscriptionGate                                                    │
│    ├─ PaywallView  (plan details, "Subscribe" button)                │
│    └─ CheckoutForm (Stripe PaymentElement, embedded)                 │
│         ├─ loadStripe(VITE_STRIPE_PUBLISHABLE_KEY)                   │
│         ├─ <Elements> provider with clientSecret                     │
│         └─ <PaymentElement> + confirm button                         │
│                                                                      │
│  API calls:                                                          │
│    POST /create-subscription  → returns { clientSecret, subId }      │
│    GET  /subscription-status  → returns { status }                   │
└──────────────────┬───────────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Backend (Amplify Gen 2 — Lambda Functions)                          │
│                                                                      │
│  create-subscription/handler.ts                                      │
│    1. Verify Cognito JWT (userId from event.identity)                │
│    2. Find or create Stripe Customer (metadata.cognitoUserId)        │
│    3. Create Stripe Subscription (payment_behavior:                  │
│       'default_incomplete', expand: latest_invoice.payment_intent)   │
│    4. Return PaymentIntent client_secret + subscription ID           │
│                                                                      │
│  subscription-status/handler.ts                                      │
│    1. Verify Cognito JWT                                             │
│    2. Look up Subscription record in Amplify Data by userId          │
│    3. Return { status, currentPeriodEnd }                            │
│                                                                      │
│  stripe-webhook/handler.ts  (existing, enhanced)                     │
│    1. Verify Stripe signature                                        │
│    2. On invoice.payment_succeeded → upsert Subscription to 'active' │
│    3. On customer.subscription.updated → sync status                 │
│    4. On customer.subscription.deleted → mark 'canceled'             │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Why Stripe Elements Over Checkout Redirect

| Concern | Checkout Redirect (current) | Stripe Elements (proposed) |
|---------|---------------------------|---------------------------|
| UX | User leaves app, lands on stripe.com | Payment form embedded in paywall card |
| Branding | Limited Stripe Checkout customization | Full control over look and feel |
| Return flow | Relies on `?subscription=active` URL param (spoofable) | `stripe.confirmPayment()` returns result directly |
| Mobile | Opens browser tab, may lose app context | Stays in-app, works in WebView |
| PCI | Stripe handles all card data | Stripe Elements also handles all card data (PCI SAQ-A) |
| Complexity | Lower — Stripe hosts everything | Moderate — need backend endpoint + Elements integration |

**Decision:** Stripe Elements. The UX improvement and elimination of the spoofable URL param justify the added backend work.

---

## 3. New Dependencies

### Frontend (`package.json`)
```
@stripe/react-stripe-js  ^3.1.0    # React components for Stripe Elements
@stripe/stripe-js        ^9.1.0    # Already installed
```

### Backend (`amplify/functions/create-subscription/package.json`)
```
stripe                   ^17.0.0   # Stripe Node SDK
```

### Backend (`amplify/functions/stripe-webhook/package.json`)
```
stripe                   ^17.0.0   # Already partially referenced, needs actual install
```

Install:
```bash
npm install @stripe/react-stripe-js
# Backend functions have their own package.json:
cd amplify/functions/create-subscription && npm init -y && npm install stripe
cd amplify/functions/stripe-webhook && npm install stripe
```

---

## 4. Environment Variables

### Frontend (Vite — `VITE_` prefix, safe to expose)

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Initialize `loadStripe()` | `pk_test_...` or `pk_live_...` |

**Remove:** `VITE_STRIPE_CHECKOUT_URL` (no longer needed)
**Remove:** `VITE_STRIPE_CLI_WEBHOOK_URL` (dev CLI status moves to backend health check)

### Backend (Lambda env vars — secret, never exposed to client)

| Variable | Purpose | Where stored |
|----------|---------|-------------|
| `STRIPE_SECRET_KEY` | All Stripe API calls | Amplify `secret()` → AWS SSM Parameter Store |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification | Amplify `secret()` → AWS SSM |
| `STRIPE_PRICE_ID` | The $14.99/year Price object | Amplify function env or SSM |

---

## 5. Backend: `create-subscription` Lambda

**New file:** `amplify/functions/create-subscription/handler.ts`

```ts
import Stripe from 'stripe';
import type { AppSyncResolverHandler } from 'aws-lambda';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CreateSubscriptionResult {
  clientSecret: string;
  subscriptionId: string;
}

export const handler: AppSyncResolverHandler<
  Record<string, never>,
  CreateSubscriptionResult
> = async (event) => {
  const userId = event.identity?.sub;
  const userEmail = event.identity?.claims?.email;

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // 1. Find existing Stripe Customer or create one
  const existing = await stripe.customers.search({
    query: `metadata["cognitoUserId"]:"${userId}"`,
  });

  let customer: Stripe.Customer;
  if (existing.data.length > 0) {
    customer = existing.data[0];
  } else {
    customer = await stripe.customers.create({
      email: userEmail,
      metadata: { cognitoUserId: userId },
    });
  }

  // 2. Check for existing active/incomplete subscription
  const existingSubs = await stripe.subscriptions.list({
    customer: customer.id,
    status: 'active',
    limit: 1,
  });

  if (existingSubs.data.length > 0) {
    throw new Error('Already subscribed');
  }

  // 3. Create Subscription with incomplete status to get PaymentIntent
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: process.env.STRIPE_PRICE_ID! }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
    metadata: { cognitoUserId: userId },
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

  return {
    clientSecret: paymentIntent.client_secret!,
    subscriptionId: subscription.id,
  };
};
```

**Resource definition:** `amplify/functions/create-subscription/resource.ts`

```ts
import { defineFunction, secret } from '@aws-amplify/backend';

export const createSubscription = defineFunction({
  name: 'create-subscription',
  entry: './handler.ts',
  environment: {
    STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
    STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID || '',
  },
  timeoutSeconds: 15,
});
```

---

## 6. Backend: `subscription-status` Lambda

**New file:** `amplify/functions/subscription-status/handler.ts`

```ts
import Stripe from 'stripe';
import type { AppSyncResolverHandler } from 'aws-lambda';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface SubscriptionStatusResult {
  status: 'none' | 'active' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
}

export const handler: AppSyncResolverHandler<
  Record<string, never>,
  SubscriptionStatusResult
> = async (event) => {
  const userId = event.identity?.sub;

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Look up Stripe Customer by Cognito userId
  const customers = await stripe.customers.search({
    query: `metadata["cognitoUserId"]:"${userId}"`,
  });

  if (customers.data.length === 0) {
    return { status: 'none', currentPeriodEnd: null, stripeCustomerId: null };
  }

  const customer = customers.data[0];

  // Get their subscriptions
  const subs = await stripe.subscriptions.list({
    customer: customer.id,
    limit: 1,
    status: 'all',
  });

  if (subs.data.length === 0) {
    return { status: 'none', currentPeriodEnd: null, stripeCustomerId: customer.id };
  }

  const sub = subs.data[0];

  return {
    status: sub.status as SubscriptionStatusResult['status'],
    currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
    stripeCustomerId: customer.id,
  };
};
```

This approach queries Stripe directly as the source of truth rather than maintaining a separate Amplify Data table for subscription status. This simplifies the architecture for V1 — the webhook still serves as the mechanism for real-time status updates if we add a Data model later.

---

## 7. Backend: Enhanced `stripe-webhook` Lambda

Update the existing `amplify/functions/stripe-webhook/handler.ts` to:

1. Actually verify signatures using the Stripe SDK (currently commented out)
2. Handle `invoice.payment_succeeded` (the event that fires when the first payment completes for the `default_incomplete` subscription)
3. Optionally update an Amplify Data `Subscription` record (Phase 2)

**Key webhook events for the Elements flow:**

| Event | When | Action |
|-------|------|--------|
| `invoice.payment_succeeded` | First payment completes | Subscription becomes `active` — this is the confirmation |
| `customer.subscription.updated` | Status changes (renewal, past_due) | Sync status |
| `customer.subscription.deleted` | Canceled and period ended | Mark inactive |
| `invoice.payment_failed` | Renewal fails | Could notify parent |

**Note:** `checkout.session.completed` is no longer needed since we're not using Checkout Sessions.

---

## 8. Amplify Data Schema — Wire Custom Queries

Update `amplify/data/resource.ts` to expose the Lambda functions as custom queries:

```ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createSubscription } from "../functions/create-subscription/resource";
import { subscriptionStatus } from "../functions/subscription-status/resource";

const schema = a.schema({
  // Custom queries backed by Lambda
  createSubscription: a
    .query()
    .returns(a.customType({
      clientSecret: a.string().required(),
      subscriptionId: a.string().required(),
    }))
    .handler(a.handler.function(createSubscription))
    .authorization((allow) => [allow.authenticated()]),

  subscriptionStatus: a
    .query()
    .returns(a.customType({
      status: a.string().required(),
      currentPeriodEnd: a.string(),
      stripeCustomerId: a.string(),
    }))
    .handler(a.handler.function(subscriptionStatus))
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
```

Update `amplify/backend.ts`:

```ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { stripeWebhook } from './functions/stripe-webhook/resource';
import { createSubscription } from './functions/create-subscription/resource';
import { subscriptionStatus } from './functions/subscription-status/resource';

const backend = defineBackend({
  auth,
  data,
  stripeWebhook,
  createSubscription,
  subscriptionStatus,
});

// Expose stripe webhook as a public Function URL (Stripe signs requests)
const webhookFn = backend.stripeWebhook.resources.lambda;
const fnUrl = webhookFn.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
});

// Output the webhook URL for registering in Stripe Dashboard
new CfnOutput(backend.stripeWebhook.resources.lambda.stack, 'StripeWebhookUrl', {
  value: fnUrl.url,
});
```

---

## 9. Frontend: Component Structure

### Revised `SubscriptionGate.tsx`

```
SubscriptionGate
├── Loading state → <LoadingScreen />
├── Active subscription → {children} (+ test mode banner in dev)
└── Inactive → PaywallView
     ├── Plan details ($14.99/year, feature list)
     ├── "Subscribe Now" button → triggers createSubscription query
     └── When clientSecret is obtained:
          └── <Elements stripe={stripePromise} options={{ clientSecret }}>
               └── <CheckoutForm />
                    ├── <PaymentElement />
                    ├── "Pay $14.99/year" submit button
                    ├── Error display
                    └── Success → re-check subscription status → grant access
```

### Key Frontend Logic

```tsx
// src/components/SubscriptionGate.tsx (pseudocode of new flow)

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { generateClient } from 'aws-amplify/data';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const client = generateClient<Schema>();

// Step 1: On mount, call subscriptionStatus query to check status
// Step 2: If inactive, show paywall
// Step 3: On "Subscribe" click, call createSubscription query → get clientSecret
// Step 4: Render <Elements> with clientSecret, show <PaymentElement>
// Step 5: On form submit, call stripe.confirmPayment({ redirect: 'if_required' })
// Step 6: On success, poll subscriptionStatus until 'active' (max 10s)
// Step 7: Cache status in localStorage, render children

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',  // Stay in-app; only redirect for 3DS if needed
    });

    if (error) {
      // Show error to user
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>Pay $14.99/year</button>
    </form>
  );
}
```

### Subscription Status Check (replaces localStorage-only approach)

The current flow checks localStorage and URL params. The new flow:

1. **On mount:** Check localStorage cache first (instant UI)
2. **Then:** Call `subscriptionStatus` query to verify against Stripe (source of truth)
3. **If mismatch:** Update localStorage cache
4. **If no subscription:** Show paywall with embedded payment form

This eliminates the spoofable `?subscription=active` URL parameter.

---

## 10. Stripe Elements Appearance Customization

Match the NumPals design system:

```ts
const elementsAppearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: colors.mint,       // #5EC4A0
    colorBackground: '#ffffff',
    colorText: colors.charcoal,      // #333333
    fontFamily: fontStack,
    borderRadius: '12px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '2px solid #e5e7eb',
      padding: '12px',
    },
    '.Input:focus': {
      borderColor: colors.mint,
      boxShadow: `0 0 0 2px ${colors.mint}40`,
    },
  },
};
```

---

## 11. Confirmation Flow (No Page Redirect)

```
User clicks "Pay"
    │
    ▼
stripe.confirmPayment({ redirect: 'if_required' })
    │
    ├─ No 3DS required ──► paymentIntent.status === 'succeeded'
    │                           │
    │                           ▼
    │                       Show "Activating..." spinner
    │                       Poll subscriptionStatus query (1s intervals, max 10s)
    │                       Webhook fires → Stripe subscription becomes 'active'
    │                       Status returns 'active' → cache + render app
    │
    └─ 3DS required ──► Stripe handles 3DS modal/redirect
                            │
                            ▼
                        Returns to app with result
                        Same polling flow as above
```

**Why polling instead of just trusting `paymentIntent.status`?**

The PaymentIntent succeeding doesn't guarantee the Subscription is `active` — there's a brief async gap. Polling the `subscriptionStatus` query (which calls `stripe.subscriptions.list`) ensures we see the actual subscription state. In practice this resolves in 1-2 seconds.

---

## 12. Cognito ↔ Stripe Customer Linking

**Strategy:** Store `cognitoUserId` in Stripe Customer `metadata`.

```
Cognito User                     Stripe Customer
┌──────────────────┐             ┌──────────────────┐
│ sub: abc-123     │─────────────│ metadata: {      │
│ email: p@ex.com  │             │   cognitoUserId: │
│                  │             │   "abc-123"      │
└──────────────────┘             │ }                │
                                 │ email: p@ex.com  │
                                 └──────────────────┘
```

- **On `createSubscription`:** Search for existing customer by `metadata["cognitoUserId"]`, create if not found
- **On `subscriptionStatus`:** Same search to find the customer's subscriptions
- **On webhook events:** The subscription's `metadata.cognitoUserId` links back to Cognito

No additional Cognito custom attributes or DynamoDB tables needed for V1.

---

## 13. File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Edit | Add `@stripe/react-stripe-js` |
| `src/components/SubscriptionGate.tsx` | Rewrite | Replace redirect with Elements form + status query |
| `amplify/functions/create-subscription/handler.ts` | Create | Lambda: create Stripe Customer + Subscription |
| `amplify/functions/create-subscription/resource.ts` | Create | Function definition with secrets |
| `amplify/functions/create-subscription/package.json` | Create | `stripe` dependency |
| `amplify/functions/subscription-status/handler.ts` | Create | Lambda: query Stripe for sub status |
| `amplify/functions/subscription-status/resource.ts` | Create | Function definition with secrets |
| `amplify/functions/subscription-status/package.json` | Create | `stripe` dependency |
| `amplify/functions/stripe-webhook/handler.ts` | Edit | Add real signature verification, handle `invoice.payment_succeeded` |
| `amplify/functions/stripe-webhook/package.json` | Create | `stripe` dependency |
| `amplify/data/resource.ts` | Rewrite | Replace Todo with custom queries |
| `amplify/backend.ts` | Edit | Register new functions, add Function URL for webhook |
| `.env` / `.env.local` | Edit | Add `VITE_STRIPE_PUBLISHABLE_KEY`, remove `VITE_STRIPE_CHECKOUT_URL` |

---

## 14. Removed

The following are removed by this change:

- `VITE_STRIPE_CHECKOUT_URL` env var and all references
- `VITE_STRIPE_CLI_WEBHOOK_URL` env var and `StripeCliStatus` component
- `?subscription=active` URL parameter handling (spoofable)
- `window.location.href` redirect to Stripe

---

## 15. Implementation Order

1. **Backend first:** Create `create-subscription` and `subscription-status` Lambda functions
2. **Data schema:** Update `amplify/data/resource.ts` with custom queries
3. **Backend config:** Update `amplify/backend.ts` with new functions and Function URL
4. **Webhook:** Enhance existing webhook handler with real Stripe SDK verification
5. **Frontend:** Install `@stripe/react-stripe-js`, rewrite `SubscriptionGate.tsx`
6. **Test:** Use Stripe test mode + test card numbers (`4242 4242 4242 4242`)
7. **Deploy:** Set secrets in Amplify console, register webhook URL in Stripe Dashboard
