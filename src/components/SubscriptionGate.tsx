import { useState, useEffect, useCallback } from 'react';
import { signOut, fetchAuthSession } from 'aws-amplify/auth';
import { loadStripe, type Appearance } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { colors, fontStack } from '../styles/theme';
import outputs from '../../amplify_outputs.json';

/** Stripe publishable key (test or live depending on env) */
const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

/** Whether we're running in dev/test mode */
const IS_DEV = import.meta.env.DEV;

/** Stripe CLI webhook status endpoint (dev only) */
const STRIPE_CLI_WEBHOOK_URL = import.meta.env.VITE_STRIPE_CLI_WEBHOOK_URL || '';

/** localStorage key for subscription status */
const SUB_STORAGE_KEY = 'numpals-subscription';

/**
 * Subscription plan info — sourced from Amplify Hosting env vars set by the
 * orchestrator's setup_stripe_subscription / update_stripe_price commands.
 * The orchestrator keeps these in sync with the actual Stripe Product/Price.
 */
const PLAN_NAME = import.meta.env.VITE_STRIPE_PLAN_NAME || 'NumPals';
const PLAN_AMOUNT_CENTS = parseInt(import.meta.env.VITE_STRIPE_PLAN_AMOUNT || '0', 10);
const PLAN_CURRENCY = (import.meta.env.VITE_STRIPE_PLAN_CURRENCY || 'usd').toLowerCase();
const PLAN_INTERVAL = (import.meta.env.VITE_STRIPE_PLAN_INTERVAL || 'month') as 'day' | 'week' | 'month' | 'year';

/** Format a cents amount as a localized currency string. Falls back gracefully if Intl is unsupported. */
function formatPrice(cents: number, currency: string): string {
  if (!cents) return '—';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

/** Human-friendly interval label, e.g. "month" → "per month" */
function intervalLabel(interval: string): string {
  switch (interval) {
    case 'day': return 'per day';
    case 'week': return 'per week';
    case 'year': return 'per year';
    case 'month':
    default: return 'per month';
  }
}

const stripePromise = STRIPE_PK ? loadStripe(STRIPE_PK) : null;

/** Stripe Elements appearance matching NumPals design system */
const elementsAppearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: colors.mint,
    colorBackground: '#ffffff',
    colorText: colors.charcoal,
    fontFamily: fontStack,
    borderRadius: '12px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '2px solid #e5e7eb',
      padding: '12px',
    },
    '.Input:focus': {
      borderColor: colors.mint,
      boxShadow: `0 0 0 2px ${colors.mint}40`,
    },
  },
};

interface SubscriptionStatus {
  active: boolean;
  customerId?: string;
}

function loadCachedSubscription(): SubscriptionStatus | null {
  try {
    const raw = localStorage.getItem(SUB_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function cacheSubscription(status: SubscriptionStatus): void {
  try {
    localStorage.setItem(SUB_STORAGE_KEY, JSON.stringify(status));
  } catch {
    // Storage unavailable
  }
}

interface SubscriptionGateProps {
  children: React.ReactNode;
}

/** Stripe CLI connection status badge (dev only) */
function StripeCliStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    if (!STRIPE_CLI_WEBHOOK_URL) {
      setStatus('disconnected');
      return;
    }
    fetch(STRIPE_CLI_WEBHOOK_URL, { method: 'GET', mode: 'no-cors' })
      .then(() => setStatus('connected'))
      .catch(() => setStatus('disconnected'));
  }, []);

  const dotColor = status === 'connected' ? '#22c55e' : status === 'disconnected' ? '#ef4444' : '#facc15';
  const label = status === 'checking' ? 'Checking...' : status === 'connected' ? 'CLI Connected' : 'CLI Disconnected';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      background: 'rgba(0,0,0,0.05)',
      borderRadius: 8,
      fontSize: '0.75rem',
      color: 'rgba(0,0,0,0.6)',
    }}>
      <div style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: dotColor,
        flexShrink: 0,
      }} />
      <span>Stripe CLI: {label}</span>
      {STRIPE_CLI_WEBHOOK_URL && (
        <span style={{ opacity: 0.5, marginLeft: 4 }}>({STRIPE_CLI_WEBHOOK_URL})</span>
      )}
    </div>
  );
}

/** The Stripe test mode banner shown in dev */
function TestModeBanner() {
  if (!IS_DEV) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: '#fbbf24',
      color: '#000',
      textAlign: 'center',
      padding: '4px 12px',
      fontSize: '0.75rem',
      fontFamily: fontStack,
      fontWeight: 700,
      letterSpacing: '0.05em',
    }}>
      ⚠ STRIPE TEST MODE
    </div>
  );
}

/** Embedded checkout form with Stripe PaymentElement */
function CheckoutForm({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed. Please try again.');
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      // Payment succeeded — poll subscription status to confirm activation
      setProcessing(true);
      let attempts = 0;
      const poll = async () => {
        attempts++;
        try {
          const session = await fetchAuthSession();
          const token = session.tokens?.idToken?.toString();
          if (!token) throw new Error('No auth token');

          const resp = await callGraphQL(token, 'subscriptionStatus', `
            query subscriptionStatus { subscriptionStatus { status currentPeriodEnd stripeCustomerId } }
          `);
          if (resp?.status === 'active') {
            cacheSubscription({ active: true, customerId: resp.stripeCustomerId || undefined });
            onSuccess();
            return;
          }
        } catch {
          // Retry
        }
        if (attempts < 10) {
          setTimeout(poll, 1000);
        } else {
          // Assume success after timeout — webhook may be slow
          cacheSubscription({ active: true });
          onSuccess();
        }
      };
      poll();
    } else {
      setError('Payment requires additional action. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />

      {error && (
        <div style={{
          background: '#fef2f2',
          color: '#dc2626',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: '0.85rem',
          marginTop: 12,
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          background: colors.mint,
          color: '#fff',
          fontSize: '1.1rem',
          fontWeight: 700,
          fontFamily: fontStack,
          cursor: processing ? 'wait' : 'pointer',
          opacity: (!stripe || processing) ? 0.7 : 1,
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        {processing ? 'Processing...' : 'Pay $14.99/year'}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={processing}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(0,0,0,0.4)',
          fontSize: '0.85rem',
          cursor: 'pointer',
          fontFamily: fontStack,
          width: '100%',
          padding: '8px',
        }}
      >
        Back
      </button>
    </form>
  );
}

/** Helper to call AppSync GraphQL queries with a Cognito JWT */
async function callGraphQL(token: string, operationName: string, query: string) {
  const endpoint = (outputs as Record<string, unknown> & { data?: { url?: string } })?.data?.url;
  if (!endpoint) throw new Error('AppSync endpoint not configured');

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ query, operationName }),
  });

  const json = await resp.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'GraphQL error');
  }
  return json.data?.[operationName];
}

export default function SubscriptionGate({ children }: SubscriptionGateProps) {
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(loadCachedSubscription);
  const [verifying, setVerifying] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState('');
  const [loading, setLoading] = useState(false);

  // Verify subscription status against Stripe on mount
  useEffect(() => {
    let cancelled = false;
    const verify = async () => {
      setVerifying(true);
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (!token) return;

        const result = await callGraphQL(token, 'subscriptionStatus', `
          query subscriptionStatus { subscriptionStatus { status currentPeriodEnd stripeCustomerId } }
        `);

        if (cancelled) return;

        if (result?.status === 'active') {
          const status: SubscriptionStatus = { active: true, customerId: result.stripeCustomerId || undefined };
          cacheSubscription(status);
          setSubStatus(status);
        } else {
          // Clear stale cache if Stripe says not active
          localStorage.removeItem(SUB_STORAGE_KEY);
          setSubStatus(null);
        }
      } catch {
        // If verification fails, trust the cache (offline tolerance)
      } finally {
        if (!cancelled) setVerifying(false);
      }
    };
    verify();
    return () => { cancelled = true; };
  }, []);

  const handleSubscribe = useCallback(async () => {
    setLoading(true);
    setCheckoutError('');
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) {
        setCheckoutError('Authentication error. Please sign out and sign back in.');
        return;
      }

      const result = await callGraphQL(token, 'createSubscription', `
        mutation createSubscription { createSubscription { clientSecret subscriptionId } }
      `);

      if (result?.clientSecret) {
        setClientSecret(result.clientSecret);
      } else {
        setCheckoutError('Could not start subscription. Please try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      if (message.includes('Already subscribed')) {
        // User is already subscribed — refresh status
        cacheSubscription({ active: true });
        setSubStatus({ active: true });
      } else {
        setCheckoutError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    cacheSubscription({ active: true });
    setSubStatus({ active: true });
    setClientSecret(null);
  }, []);

  // Active subscription — render children. Subscription management lives
  // in the Parent Dashboard (PIN-gated) so kids can't tap it.
  if (subStatus?.active) {
    return (
      <>
        <TestModeBanner />
        {children}
      </>
    );
  }

  // Show loading while verifying (but only if we don't have a cached status)
  if (verifying && !subStatus) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `linear-gradient(180deg, ${colors.cream}, ${colors.lavender}40)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fontStack,
      }}>
        <TestModeBanner />
        <div style={{ color: 'rgba(0,0,0,0.5)', fontSize: '1rem' }}>
          Checking subscription...
        </div>
      </div>
    );
  }

  // Paywall — no active subscription
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: `linear-gradient(180deg, ${colors.cream}, ${colors.lavender}40)`,
      // Vertical scroll when content is taller than viewport (mobile, short screens, expanded payment form)
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      fontFamily: fontStack,
      padding: 20,
      // Account for the test mode banner so the card doesn't sit underneath it
      paddingTop: 60,
    }}>
      <TestModeBanner />
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '32px 28px',
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        // Allow the card to grow naturally; the parent handles scroll
        marginBottom: 20,
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: colors.coral }}>{PLAN_NAME}</h1>
        <p style={{ color: 'rgba(0,0,0,0.6)', margin: '8px 0 24px' }}>
          Subscribe to start learning with {PLAN_NAME}!
        </p>

        {clientSecret && stripePromise ? (
          /* Stripe Elements payment form */
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: elementsAppearance }}
          >
            <CheckoutForm
              onSuccess={handlePaymentSuccess}
              onBack={() => setClientSecret(null)}
            />
          </Elements>
        ) : (
          /* Plan details + subscribe button */
          <>
            <div style={{
              background: `${colors.mint}10`,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: 20,
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: colors.charcoal }}>
                {formatPrice(PLAN_AMOUNT_CENTS, PLAN_CURRENCY)}
              </div>
              <div style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.9rem' }}>{intervalLabel(PLAN_INTERVAL)}</div>
              <ul style={{ textAlign: 'left', margin: '16px 0 0', padding: '0 0 0 20px', color: 'rgba(0,0,0,0.7)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                <li>Unlimited math lessons</li>
                <li>All NumPals characters</li>
                <li>Progress tracking for multiple kids</li>
                <li>No ads, ever</li>
              </ul>
            </div>

            {checkoutError && (
              <div style={{
                background: '#fef2f2',
                color: '#dc2626',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: '0.85rem',
                marginBottom: 12,
              }}>
                {checkoutError}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubscribe}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: colors.mint,
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 700,
                fontFamily: fontStack,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginBottom: 12,
              }}
            >
              {loading ? 'Setting up...' : 'Subscribe Now'}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => signOut()}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(0,0,0,0.4)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: fontStack,
          }}
        >
          Sign out
        </button>

        {IS_DEV && (
          <div style={{ marginTop: 16 }}>
            <StripeCliStatus />
          </div>
        )}
      </div>
    </div>
  );
}
