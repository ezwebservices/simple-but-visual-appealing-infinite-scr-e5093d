import { defineFunction, secret } from '@aws-amplify/backend';

export const billingPortal = defineFunction({
  name: 'billing-portal',
  entry: './handler.ts',
  environment: {
    STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
    // Where Stripe should redirect the user back to after they finish in the portal
    BILLING_PORTAL_RETURN_URL: process.env.BILLING_PORTAL_RETURN_URL || 'https://main.d378sxzdjrhmnm.amplifyapp.com',
  },
  timeoutSeconds: 15,
});
