import Stripe from 'stripe';
import type { AppSyncResolverHandler } from 'aws-lambda';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CreateSubscriptionResult {
  clientSecret: string;
  subscriptionId: string;
}

export const handler: AppSyncResolverHandler<
  Record<string, never>,
  CreateSubscriptionResult
> = async (event) => {
  const userId = event.identity && 'sub' in event.identity ? event.identity.sub : undefined;
  const userEmail =
    event.identity && 'claims' in event.identity
      ? (event.identity.claims as Record<string, string>).email
      : undefined;

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Find existing Stripe Customer or create one
  const existing = await stripe.customers.search({
    query: `metadata["cognitoUserId"]:"${userId}"`,
  });

  let customer: Stripe.Customer;
  if (existing.data.length > 0) {
    customer = existing.data[0];
  } else {
    customer = await stripe.customers.create({
      email: userEmail,
      metadata: { cognitoUserId: userId },
    });
  }

  // Check for existing active subscription
  const existingSubs = await stripe.subscriptions.list({
    customer: customer.id,
    status: 'active',
    limit: 1,
  });

  if (existingSubs.data.length > 0) {
    throw new Error('Already subscribed');
  }

  // Create Subscription with incomplete status to get PaymentIntent
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: process.env.STRIPE_PRICE_ID! }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
    metadata: { cognitoUserId: userId },
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

  return {
    clientSecret: paymentIntent.client_secret!,
    subscriptionId: subscription.id,
  };
};
