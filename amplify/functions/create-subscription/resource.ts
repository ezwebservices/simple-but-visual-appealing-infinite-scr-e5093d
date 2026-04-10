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
