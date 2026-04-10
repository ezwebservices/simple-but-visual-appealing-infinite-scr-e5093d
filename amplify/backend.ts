import { defineBackend } from '@aws-amplify/backend';
import { FunctionUrlAuthType, Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { CfnOutput } from 'aws-cdk-lib';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { stripeWebhook } from './functions/stripe-webhook/resource';
import { createSubscription } from './functions/create-subscription/resource';
import { subscriptionStatus } from './functions/subscription-status/resource';
import { billingPortal } from './functions/billing-portal/resource';

/**
 * NumPals backend — auth, data, Stripe subscription functions, webhook handler,
 * and billing portal session creator.
 */
const backend = defineBackend({
  auth,
  data,
  stripeWebhook,
  createSubscription,
  subscriptionStatus,
  billingPortal,
});

// ────────────────────────────────────────────────────────────────────
// STRIPE WEBHOOK — Function URL + DynamoDB access
// `backend.X.resources.lambda` returns the IFunction interface; cast to
// the concrete Function class to access addEnvironment().
// ────────────────────────────────────────────────────────────────────
const webhookFn = backend.stripeWebhook.resources.lambda as LambdaFunction;
const fnUrl = webhookFn.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
});

new CfnOutput(webhookFn.stack, 'StripeWebhookUrl', {
  value: fnUrl.url,
});

// Grant the webhook lambda read/write access to the Subscription + ProcessedWebhookEvent tables
const subscriptionTable = backend.data.resources.tables['Subscription'];
const processedEventTable = backend.data.resources.tables['ProcessedWebhookEvent'];

if (subscriptionTable) {
  subscriptionTable.grantReadWriteData(webhookFn);
  webhookFn.addEnvironment('SUBSCRIPTION_TABLE_NAME', subscriptionTable.tableName);
}
if (processedEventTable) {
  processedEventTable.grantReadWriteData(webhookFn);
  webhookFn.addEnvironment('PROCESSED_EVENT_TABLE_NAME', processedEventTable.tableName);
}

// ────────────────────────────────────────────────────────────────────
// SUBSCRIPTION-STATUS LAMBDA — read access to Subscription table
// ────────────────────────────────────────────────────────────────────
const statusFn = backend.subscriptionStatus.resources.lambda as LambdaFunction;
if (subscriptionTable) {
  subscriptionTable.grantReadData(statusFn);
  statusFn.addEnvironment('SUBSCRIPTION_TABLE_NAME', subscriptionTable.tableName);
}
