import { useState, useEffect, useCallback } from 'react';
import { signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { colors, fontStack } from '../styles/theme';

/** Stripe Payment Link (test-mode or live depending on env) */
const STRIPE_CHECKOUT_URL = import.meta.env.VITE_STRIPE_CHECKOUT_URL || '';

/** Whether we're running in dev/test mode */
const IS_DEV = import.meta.env.DEV;

/** Stripe CLI webhook status endpoint (dev only) */
const STRIPE_CLI_WEBHOOK_URL = import.meta.env.VITE_STRIPE_CLI_WEBHOOK_URL || '';

/** localStorage key for subscription status (cached — verified via webhook in production) */
const SUB_STORAGE_KEY = 'numpals-subscription';

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

export default function SubscriptionGate({ children }: SubscriptionGateProps) {
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(loadCachedSubscription);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetchUserAttributes().then((attrs) => {
      if (attrs.email) setUserEmail(attrs.email);
    }).catch(() => {});
  }, []);

  const handleCheckout = useCallback(async () => {
    setLoading(true);
    setCheckoutError('');
    try {
      if (!STRIPE_CHECKOUT_URL) {
        setCheckoutError('Payment is not configured. Please contact support.');
        return;
      }
      const separator = STRIPE_CHECKOUT_URL.includes('?') ? '&' : '?';
      window.location.href = `${STRIPE_CHECKOUT_URL}${separator}prefilled_email=${encodeURIComponent(userEmail)}`;
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Check URL params for subscription callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscription') === 'active') {
      const activeSub: SubscriptionStatus = { active: true };
      cacheSubscription(activeSub);
      setSubStatus(activeSub);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Only allow access if subscription is active — no trial bypass
  if (subStatus?.active) {
    return (
      <>
        {IS_DEV && (
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
        )}
        {children}
      </>
    );
  }

  // Paywall — no active subscription
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: `linear-gradient(180deg, ${colors.cream}, ${colors.lavender}40)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: fontStack,
      padding: 20,
    }}>
      {IS_DEV && (
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
      )}
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '32px 28px',
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: colors.coral }}>NumPals</h1>
        <p style={{ color: 'rgba(0,0,0,0.6)', margin: '8px 0 24px' }}>
          Subscribe to start learning with NumPals!
        </p>

        <div style={{
          background: `${colors.mint}10`,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: colors.charcoal }}>
            $14.99
          </div>
          <div style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.9rem' }}>per year</div>
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
          onClick={handleCheckout}
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
          {loading ? 'Redirecting to checkout...' : 'Subscribe Now'}
        </button>

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
