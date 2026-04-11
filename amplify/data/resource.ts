import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createSubscription } from "../functions/create-subscription/resource";
import { subscriptionStatus } from "../functions/subscription-status/resource";
import { billingPortal } from "../functions/billing-portal/resource";
import { stripeWebhook } from "../functions/stripe-webhook/resource";

const schema = a.schema({
  // ────────────────────────────────────────────────────────────
  // CHILD PROFILE — per-user owned learning profiles
  // Each parent account can have multiple child profiles, each
  // with their own mastery progress and activity history.
  // ────────────────────────────────────────────────────────────
  ChildProfile: a
    .model({
      childId: a.string().required(),         // client-generated UUID
      name: a.string().required(),
      avatar: a.string().required(),
      // Progress data is stored as JSON for flexibility — the schema for
      // SubConceptProgress + accuracyHistory + recentActivity is enforced
      // client-side (TypeScript types in src/types.ts).
      conceptProgress: a.json().required(),   // Record<SubConcept, SubConceptProgress>
      accuracyHistory: a.json(),              // Array<{ date, accuracy, concept }>
      recentActivity: a.json(),               // Array<ActivityEntry>
    })
    .authorization((allow) => [allow.owner()]),

  // ────────────────────────────────────────────────────────────
  // USER SETTINGS — per-user account-wide preferences that should
  // sync across devices. Currently stores the hashed parent PIN so a
  // parent isn't forced to set a new PIN on each device they sign in on.
  // One row per user; the Cognito sub is used as the owner automatically.
  // ────────────────────────────────────────────────────────────
  UserSettings: a
    .model({
      parentPinHash: a.string(),              // SHA-256 hex of the 4-digit PIN
    })
    .authorization((allow) => [allow.owner()]),

  // ────────────────────────────────────────────────────────────
  // USER SUBSCRIPTION — per-user mirror of the Stripe subscription state.
  // Named UserSubscription (not Subscription) because "Subscription" is
  // a reserved GraphQL root operation type and cannot be used as a model.
  // Owner can READ. Webhook Lambda updates via direct DDB SDK
  // (NOT via this GraphQL API — see stripe-webhook handler).
  // ────────────────────────────────────────────────────────────
  UserSubscription: a
    .model({
      // The Cognito user sub is used as the owner field automatically.
      status: a.string().required(),          // 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing' | 'none'
      stripeCustomerId: a.string().required(),
      stripeSubscriptionId: a.string(),
      currentPeriodEnd: a.datetime(),
      cancelAtPeriodEnd: a.boolean(),
      lastEventId: a.string(),                // Stripe event ID that last touched this row
      lastEventAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner().to(['read']),
      // Webhook lambda + subscription-status lambda need access — granted
      // via IAM in backend.ts (direct DynamoDB writes, not GraphQL).
    ]),

  // ────────────────────────────────────────────────────────────
  // PROCESSED WEBHOOK EVENT — idempotency tracker so a Stripe
  // retry doesn't double-process the same event.
  // ────────────────────────────────────────────────────────────
  ProcessedWebhookEvent: a
    .model({
      eventId: a.string().required(),         // Stripe event ID (primary key field)
      eventType: a.string().required(),
      processedAt: a.datetime().required(),
    })
    // Function-only access via IAM (granted in backend.ts).
    // authenticated() satisfies the schema validator; no users actually
    // query this directly — the webhook lambda writes via DDB SDK.
    .authorization((allow) => [allow.authenticated().to(['read'])]),

  // ────────────────────────────────────────────────────────────
  // CUSTOM TYPES + MUTATIONS — Stripe subscription flow
  // ────────────────────────────────────────────────────────────
  CreateSubscriptionResult: a.customType({
    clientSecret: a.string().required(),
    subscriptionId: a.string().required(),
  }),

  SubscriptionStatusResult: a.customType({
    status: a.string().required(),
    currentPeriodEnd: a.string(),
    stripeCustomerId: a.string(),
    cancelAtPeriodEnd: a.boolean(),
  }),

  BillingPortalResult: a.customType({
    url: a.string().required(),
  }),

  createSubscription: a
    .mutation()
    .returns(a.ref('CreateSubscriptionResult'))
    .handler(a.handler.function(createSubscription))
    .authorization((allow) => [allow.authenticated()]),

  subscriptionStatus: a
    .query()
    .returns(a.ref('SubscriptionStatusResult'))
    .handler(a.handler.function(subscriptionStatus))
    .authorization((allow) => [allow.authenticated()]),

  // NEW: Stripe Customer Portal session for cancel/update card/invoices
  createBillingPortalSession: a
    .mutation()
    .returns(a.ref('BillingPortalResult'))
    .handler(a.handler.function(billingPortal))
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});

// Re-export the webhook function so backend.ts can grant it DDB permissions
// (it's not used in the schema itself, but it needs IAM access to the tables)
export { stripeWebhook };
