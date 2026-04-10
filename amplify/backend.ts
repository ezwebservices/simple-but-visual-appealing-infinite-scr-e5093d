import { defineBackend } from '@aws-amplify/backend';
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { CfnOutput } from 'aws-cdk-lib';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { stripeWebhook } from './functions/stripe-webhook/resource';
import { createSubscription } from './functions/create-subscription/resource';
import { subscriptionStatus } from './functions/subscription-status/resource';

/**
 * NumPals backend — auth, data, Stripe subscription functions, and webhook handler.
 */
const backend = defineBackend({
  auth,
  data,
  stripeWebhook,
  createSubscription,
  subscriptionStatus,
});

// Expose stripe webhook as a public Function URL (Stripe signs requests)
const webhookFn = backend.stripeWebhook.resources.lambda;
const fnUrl = webhookFn.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
});

// Output the webhook URL for registering in Stripe Dashboard
new CfnOutput(webhookFn.stack, 'StripeWebhookUrl', {
  value: fnUrl.url,
});
