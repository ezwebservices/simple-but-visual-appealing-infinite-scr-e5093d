import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createSubscription } from "../functions/create-subscription/resource";
import { subscriptionStatus } from "../functions/subscription-status/resource";

const schema = a.schema({
  CreateSubscriptionResult: a.customType({
    clientSecret: a.string().required(),
    subscriptionId: a.string().required(),
  }),

  SubscriptionStatusResult: a.customType({
    status: a.string().required(),
    currentPeriodEnd: a.string(),
    stripeCustomerId: a.string(),
  }),

  createSubscription: a
    .query()
    .returns(a.ref('CreateSubscriptionResult'))
    .handler(a.handler.function(createSubscription))
    .authorization((allow) => [allow.authenticated()]),

  subscriptionStatus: a
    .query()
    .returns(a.ref('SubscriptionStatusResult'))
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
