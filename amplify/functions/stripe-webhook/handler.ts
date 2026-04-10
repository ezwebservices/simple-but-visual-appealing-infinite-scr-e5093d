/**
 * Stripe Webhook Handler — processes subscription lifecycle events.
 *
 * Verifies Stripe signatures using the Stripe SDK and handles events
 * for the custom in-app subscription flow (Stripe Elements).
 */

import Stripe from 'stripe';
import type { APIGatewayProxyHandler } from 'aws-lambda';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

  try {
    switch (stripeEvent.type) {
      case 'invoice.payment_succeeded': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription;
        const customerId = invoice.customer;
        console.log(`[NumPals] Payment succeeded: customer=${customerId}, sub=${subscriptionId}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const status = subscription.status;
        const customerId = subscription.customer;
        const cognitoUserId = subscription.metadata?.cognitoUserId;
        console.log(`[NumPals] Subscription updated: customer=${customerId}, status=${status}, cognitoUser=${cognitoUserId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const customerId = subscription.customer;
        const cognitoUserId = subscription.metadata?.cognitoUserId;
        console.log(`[NumPals] Subscription deleted: customer=${customerId}, cognitoUser=${cognitoUserId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        const customerId = invoice.customer;
        console.log(`[NumPals] Payment failed: customer=${customerId}`);
        break;
      }

      default:
        console.log(`[NumPals] Unhandled event type: ${stripeEvent.type}`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error('[NumPals] Webhook error:', err);
    return { statusCode: 400, body: 'Webhook processing error' };
  }
};
