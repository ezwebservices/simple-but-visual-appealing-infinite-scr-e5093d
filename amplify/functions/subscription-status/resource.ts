import { defineFunction } from '@aws-amplify/backend';

/**
 * Subscription status query handler.
 *
 * Reads from the UserSubscription DynamoDB table (no Stripe SDK call).
 * Pinned to the 'data' resource group to avoid the function↔data
 * circular dependency in CloudFormation.
 */
export const subscriptionStatus = defineFunction({
  name: 'subscription-status',
  entry: './handler.ts',
  resourceGroupName: 'data',
  timeoutSeconds: 15,
});
