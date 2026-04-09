/**
 * Stripe Webhook Handler — processes subscription lifecycle events.
 *
 * Deploy as an Amplify Function (Lambda) with the STRIPE_WEBHOOK_SECRET
 * environment variable set. Stripe sends events here when a subscription
 * is created, updated, or cancelled.
 *
 * In production, this handler should update the user's subscription status
 * in a database (e.g., Amplify Data / DynamoDB). For now it logs events
 * and returns 200 so Stripe doesn't retry.
 */

import type { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return { statusCode: 400, body: 'Missing signature or webhook secret' };
  }

  // In production, use the Stripe SDK to verify the signature:
  // import Stripe from 'stripe';
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const event = stripe.webhooks.constructEvent(event.body!, sig, webhookSecret);

  try {
    const body = JSON.parse(event.body || '{}');
    const eventType: string = body.type;

    switch (eventType) {
      case 'checkout.session.completed': {
        const session = body.data?.object;
        const customerEmail = session?.customer_email || session?.customer_details?.email;
        const subscriptionId = session?.subscription;
        console.log(`[NumPals] Checkout completed: email=${customerEmail}, sub=${subscriptionId}`);
        // TODO: Update user subscription status in DynamoDB
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = body.data?.object;
        const status = subscription?.status;
        const customerId = subscription?.customer;
        console.log(`[NumPals] Subscription updated: customer=${customerId}, status=${status}`);
        // TODO: Update subscription status based on status (active, past_due, canceled)
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = body.data?.object;
        const customerId = subscription?.customer;
        console.log(`[NumPals] Subscription deleted: customer=${customerId}`);
        // TODO: Mark subscription as inactive
        break;
      }

      default:
        console.log(`[NumPals] Unhandled event type: ${eventType}`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error('[NumPals] Webhook error:', err);
    return { statusCode: 400, body: 'Webhook processing error' };
  }
};
