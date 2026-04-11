import Stripe from 'stripe';
import type { AppSyncResolverHandler } from 'aws-lambda';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const RETURN_URL = process.env.BILLING_PORTAL_RETURN_URL!;

/**
 * Branded NumPals portal configuration created via the Stripe API.
 * Set headline, privacy/TOS URLs, and explicit feature toggles.
 * Fetched dynamically so a manual reconfigure in Stripe Dashboard
 * is picked up automatically (we always use the most recent active
 * configuration with our headline marker).
 */
let cachedConfigId: string | null = null;
async function getBrandedConfigId(): Promise<string | null> {
  if (cachedConfigId) return cachedConfigId;
  try {
    const list = await stripe.billingPortal.configurations.list({ limit: 100, active: true });
    // Pick the most recent config that has our NumPals headline
    const numpalsConfig = list.data
      .filter(c => c.business_profile?.headline?.includes('NumPals'))
      .sort((a, b) => b.created - a.created)[0];
    if (numpalsConfig) {
      cachedConfigId = numpalsConfig.id;
      return cachedConfigId;
    }
  } catch (e) {
    console.warn('[NumPals] Could not fetch portal configs:', e);
  }
  return null;
}

interface BillingPortalResult {
  url: string;
}

/**
 * Creates a Stripe Customer Portal session and returns the URL.
 *
 * The user is identified by their Cognito sub (event.identity.sub).
 * We look up their Stripe Customer record by the cognitoUserId metadata
 * and create a one-time portal session that lets them:
 *   - Cancel their subscription
 *   - Update payment method
 *   - View past invoices
 *   - Download receipts
 *
 * The frontend redirects the user to the returned URL. After they're
 * done, Stripe sends them back to BILLING_PORTAL_RETURN_URL.
 */
export const handler: AppSyncResolverHandler<
  Record<string, never>,
  BillingPortalResult
> = async (event) => {
  const userId = event.identity && 'sub' in event.identity ? event.identity.sub : undefined;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Find the Stripe customer for this Cognito user
  const customers = await stripe.customers.search({
    query: `metadata["cognitoUserId"]:"${userId}"`,
  });

  if (customers.data.length === 0) {
    throw new Error('No subscription found — subscribe first before opening the billing portal');
  }

  const customer = customers.data[0];

  // Use our branded NumPals portal configuration if available
  const configId = await getBrandedConfigId();

  // Create the portal session with the branded config
  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: RETURN_URL,
    ...(configId ? { configuration: configId } : {}),
  });

  return { url: session.url };
};
