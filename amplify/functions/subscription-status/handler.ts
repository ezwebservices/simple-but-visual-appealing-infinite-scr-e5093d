import Stripe from 'stripe';
import type { AppSyncResolverHandler } from 'aws-lambda';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface SubscriptionStatusResult {
  status: string;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
}

export const handler: AppSyncResolverHandler<
  Record<string, never>,
  SubscriptionStatusResult
> = async (event) => {
  const userId = event.identity && 'sub' in event.identity ? event.identity.sub : undefined;

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
    status: sub.status,
    currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
    stripeCustomerId: customer.id,
  };
};
