import { defineFunction, secret } from '@aws-amplify/backend';

export const subscriptionStatus = defineFunction({
  name: 'subscription-status',
  entry: './handler.ts',
  environment: {
    STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
  },
  timeoutSeconds: 15,
});
