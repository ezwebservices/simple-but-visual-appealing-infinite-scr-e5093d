/**
 * Stripe Webhook Handler — production version.
 *
 * Verifies Stripe signatures, deduplicates events for idempotency, and
 * mirrors subscription state into DynamoDB so the rest of the app has a
 * cached source of truth (instead of hitting Stripe API on every request).
 *
 * Persistence layout:
 *   - Subscription table:           one row per Cognito user, keyed by `owner` (the user sub)
 *   - ProcessedWebhookEvent table:  one row per Stripe event ID for idempotency
 *
 * Both table names are passed in via env vars by backend.ts at deploy time.
 */

import Stripe from 'stripe';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const SUBSCRIPTION_TABLE = process.env.SUBSCRIPTION_TABLE_NAME!;
const PROCESSED_EVENT_TABLE = process.env.PROCESSED_EVENT_TABLE_NAME!;

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────

/** Tries to record an event as processed. Returns false if already processed. */
async function tryMarkEventProcessed(eventId: string, eventType: string): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    await ddb.send(new PutCommand({
      TableName: PROCESSED_EVENT_TABLE,
      Item: {
        id: eventId,                 // Amplify-managed PK is `id`
        eventId,
        eventType,
        processedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      ConditionExpression: 'attribute_not_exists(id)',
    }));
    return true;
  } catch (err: unknown) {
    const e = err as { name?: string };
    if (e.name === 'ConditionalCheckFailedException') {
      return false;
    }
    throw err;
  }
}

/** Find the Subscription row for a Cognito user. */
async function findSubscriptionByOwner(cognitoUserId: string) {
  const result = await ddb.send(new ScanCommand({
    TableName: SUBSCRIPTION_TABLE,
    FilterExpression: '#owner = :owner',
    ExpressionAttributeNames: { '#owner': 'owner' },
    ExpressionAttributeValues: { ':owner': cognitoUserId },
    Limit: 1,
  }));
  return result.Items?.[0] ?? null;
}

/** Upsert the Subscription row for a user. */
async function upsertSubscription(params: {
  cognitoUserId: string;
  status: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  eventId: string;
}) {
  const now = new Date().toISOString();
  const existing = await findSubscriptionByOwner(params.cognitoUserId);

  if (existing) {
    await ddb.send(new UpdateCommand({
      TableName: SUBSCRIPTION_TABLE,
      Key: { id: existing.id },
      UpdateExpression:
        'SET #status = :status, stripeCustomerId = :customerId, ' +
        'stripeSubscriptionId = :subId, currentPeriodEnd = :periodEnd, ' +
        'cancelAtPeriodEnd = :cancelAtEnd, lastEventId = :eventId, ' +
        'lastEventAt = :now, updatedAt = :now',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': params.status,
        ':customerId': params.stripeCustomerId,
        ':subId': params.stripeSubscriptionId ?? null,
        ':periodEnd': params.currentPeriodEnd ?? null,
        ':cancelAtEnd': params.cancelAtPeriodEnd ?? false,
        ':eventId': params.eventId,
        ':now': now,
      },
    }));
  } else {
    await ddb.send(new PutCommand({
      TableName: SUBSCRIPTION_TABLE,
      Item: {
        id: `sub-${params.cognitoUserId}-${Date.now()}`,
        owner: params.cognitoUserId,
        status: params.status,
        stripeCustomerId: params.stripeCustomerId,
        stripeSubscriptionId: params.stripeSubscriptionId ?? null,
        currentPeriodEnd: params.currentPeriodEnd ?? null,
        cancelAtPeriodEnd: params.cancelAtPeriodEnd ?? false,
        lastEventId: params.eventId,
        lastEventAt: now,
        createdAt: now,
        updatedAt: now,
      },
    }));
  }
}

/** Resolve the Cognito user ID from a Stripe Customer (via metadata). */
async function getCognitoUserIdFromCustomer(
  customerRef: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): Promise<string | null> {
  if (!customerRef) return null;
  if (typeof customerRef !== 'string') {
    if ('metadata' in customerRef && customerRef.metadata?.cognitoUserId) {
      return customerRef.metadata.cognitoUserId;
    }
    customerRef = customerRef.id;
  }
  try {
    const customer = await stripe.customers.retrieve(customerRef);
    if ('metadata' in customer && customer.metadata?.cognitoUserId) {
      return customer.metadata.cognitoUserId;
    }
  } catch {
    /* ignore */
  }
  return null;
}

// ──────────────────────────────────────────────────────────────────
// Handler
// ──────────────────────────────────────────────────────────────────

export const handler: APIGatewayProxyHandler = async (event) => {
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return { statusCode: 400, body: 'Missing signature or webhook secret' };
  }

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body || '', sig, webhookSecret);
  } catch (err) {
    console.error('[NumPals] Webhook signature verification failed:', err);
    return { statusCode: 400, body: 'Invalid signature' };
  }

  // Idempotency: skip events we've already processed (Stripe retries on 5xx)
  const isNewEvent = await tryMarkEventProcessed(stripeEvent.id, stripeEvent.type);
  if (!isNewEvent) {
    console.log(`[NumPals] Skipping already-processed event ${stripeEvent.id}`);
    return { statusCode: 200, body: JSON.stringify({ received: true, skipped: true }) };
  }

  try {
    switch (stripeEvent.type) {
      case 'invoice.payment_succeeded': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id;
        if (!subscriptionId) break;

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = await getCognitoUserIdFromCustomer(sub.customer);
        if (!userId) {
          console.warn(`[NumPals] No Cognito user for customer ${sub.customer} on payment_succeeded`);
          break;
        }

        await upsertSubscription({
          cognitoUserId: userId,
          status: sub.status,
          stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
          stripeSubscriptionId: sub.id,
          currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          eventId: stripeEvent.id,
        });
        console.log(`[NumPals] Subscription activated for user ${userId}`);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = stripeEvent.data.object as Stripe.Subscription;
        const userId = sub.metadata?.cognitoUserId
          || await getCognitoUserIdFromCustomer(sub.customer);
        if (!userId) {
          console.warn(`[NumPals] No Cognito user for subscription ${sub.id}`);
          break;
        }

        await upsertSubscription({
          cognitoUserId: userId,
          status: sub.status,
          stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
          stripeSubscriptionId: sub.id,
          currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          eventId: stripeEvent.id,
        });
        console.log(`[NumPals] Subscription ${stripeEvent.type}: user=${userId}, status=${sub.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = stripeEvent.data.object as Stripe.Subscription;
        const userId = sub.metadata?.cognitoUserId
          || await getCognitoUserIdFromCustomer(sub.customer);
        if (!userId) break;

        await upsertSubscription({
          cognitoUserId: userId,
          status: 'canceled',
          stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
          stripeSubscriptionId: sub.id,
          currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          eventId: stripeEvent.id,
        });
        console.log(`[NumPals] Subscription canceled for user ${userId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id;
        if (!subscriptionId) break;

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = await getCognitoUserIdFromCustomer(sub.customer);
        if (!userId) break;

        await upsertSubscription({
          cognitoUserId: userId,
          status: sub.status,
          stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
          stripeSubscriptionId: sub.id,
          currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          eventId: stripeEvent.id,
        });
        console.log(`[NumPals] Payment failed for user ${userId}, status now ${sub.status}`);
        break;
      }

      default:
        console.log(`[NumPals] Unhandled event type: ${stripeEvent.type}`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error('[NumPals] Webhook processing error:', err);
    return { statusCode: 500, body: 'Webhook processing error' };
  }
};
