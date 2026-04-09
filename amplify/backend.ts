import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { stripeWebhook } from './functions/stripe-webhook/resource';

/**
 * NumPals backend — auth, data, and Stripe webhook handler.
 */
const backend = defineBackend({
  auth,
  data,
  stripeWebhook,
});
