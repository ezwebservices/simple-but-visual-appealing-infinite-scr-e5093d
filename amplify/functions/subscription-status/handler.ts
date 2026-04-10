/**
 * Subscription Status — reads the cached subscription state from DynamoDB,
 * which is kept in sync by the stripe-webhook handler.
 *
 * This is much faster than hitting the Stripe API on every request and
 * works during Stripe outages. The webhook handler is the source of truth
 * for keeping the cache fresh.
 *
 * If no row exists for the user, returns { status: 'none', ... }.
 */

import type { AppSyncResolverHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const SUBSCRIPTION_TABLE = process.env.SUBSCRIPTION_TABLE_NAME!;

interface SubscriptionStatusResult {
  status: string;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  cancelAtPeriodEnd: boolean;
}

export const handler: AppSyncResolverHandler<
  Record<string, never>,
  SubscriptionStatusResult
> = async (event) => {
  const userId = event.identity && 'sub' in event.identity ? event.identity.sub : undefined;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Find the subscription row owned by this Cognito user
  const result = await ddb.send(new ScanCommand({
    TableName: SUBSCRIPTION_TABLE,
    FilterExpression: '#owner = :owner',
    ExpressionAttributeNames: { '#owner': 'owner' },
    ExpressionAttributeValues: { ':owner': userId },
    Limit: 1,
  }));

  const row = result.Items?.[0];
  if (!row) {
    return {
      status: 'none',
      currentPeriodEnd: null,
      stripeCustomerId: null,
      cancelAtPeriodEnd: false,
    };
  }

  return {
    status: row.status as string,
    currentPeriodEnd: (row.currentPeriodEnd as string | null) ?? null,
    stripeCustomerId: (row.stripeCustomerId as string | null) ?? null,
    cancelAtPeriodEnd: Boolean(row.cancelAtPeriodEnd),
  };
};
