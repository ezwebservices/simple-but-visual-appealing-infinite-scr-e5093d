import { defineFunction, secret } from '@aws-amplify/backend';

export const createSubscription = defineFunction({
  name: 'create-subscription',
  entry: './handler.ts',
  environment: {
    STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
    // Use secret() so the runtime resolver fetches from SSM at cold start.
    // Using process.env here would bake the build-time value (empty) into the
    // Lambda env, causing "items[0][price] cannot be empty" when the function runs.
    STRIPE_PRICE_ID: secret('STRIPE_PRICE_ID'),
  },
  timeoutSeconds: 15,
});
