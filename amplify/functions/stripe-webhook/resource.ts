import { defineFunction, secret } from '@aws-amplify/backend';

/**
 * Stripe webhook handler.
 *
 * Pinned to the 'data' resource group because it writes directly to the
 * UserSubscription + ProcessedWebhookEvent DynamoDB tables (managed by the
 * data construct). Without this pin, CloudFormation forms a circular
 * dependency between the data nested stack and the function nested stack.
 */
export const stripeWebhook = defineFunction({
  name: 'stripe-webhook',
  entry: './handler.ts',
  resourceGroupName: 'data',
  environment: {
    STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
    STRIPE_WEBHOOK_SECRET: secret('STRIPE_WEBHOOK_SECRET'),
  },
});
