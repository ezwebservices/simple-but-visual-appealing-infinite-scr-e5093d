import { useState, useEffect, useCallback } from 'react';
import { signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { colors, fontStack } from '../styles/theme';

/** Stripe Payment Link or backend checkout session URL */
const STRIPE_CHECKOUT_URL = import.meta.env.VITE_STRIPE_CHECKOUT_URL || '';

/** localStorage key for subscription status (cached — verified via webhook in production) */
const SUB_STORAGE_KEY = 'numpals-subscription';

interface SubscriptionStatus {
  active: boolean;
  trialEnd?: string;
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

/**
 * 14-day free trial check.
 * Trial starts from the user's first visit (stored in localStorage).
 */
const TRIAL_KEY = 'numpals-trial-start';
const TRIAL_DAYS = 14;

function getTrialStatus(): { inTrial: boolean; daysRemaining: number } {
  let start = localStorage.getItem(TRIAL_KEY);
  if (!start) {
    start = new Date().toISOString();
    localStorage.setItem(TRIAL_KEY, start);
  }
  const elapsed = Date.now() - new Date(start).getTime();
  const daysElapsed = elapsed / (1000 * 60 * 60 * 24);
  const daysRemaining = Math.max(0, Math.ceil(TRIAL_DAYS - daysElapsed));
  return { inTrial: daysRemaining > 0, daysRemaining };
}

interface SubscriptionGateProps {
  children: React.ReactNode;
}

export default function SubscriptionGate({ children }: SubscriptionGateProps) {
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(loadCachedSubscription);
  const [trial, setTrial] = useState(getTrialStatus);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetchUserAttributes().then((attrs) => {
      if (attrs.email) setUserEmail(attrs.email);
    }).catch(() => {});
  }, []);

  // Re-check trial on mount
  useEffect(() => {
    setTrial(getTrialStatus());
  }, []);

  const handleCheckout = useCallback(async () => {
    setLoading(true);
    try {
      if (STRIPE_CHECKOUT_URL) {
        // Redirect to Stripe Payment Link or backend-created checkout session
        const separator = STRIPE_CHECKOUT_URL.includes('?') ? '&' : '?';
        window.location.href = `${STRIPE_CHECKOUT_URL}${separator}prefilled_email=${encodeURIComponent(userEmail)}`;
        return;
      }

      // No Stripe config — grant access (dev/preview mode)
      const devSub: SubscriptionStatus = { active: true };
      cacheSubscription(devSub);
      setSubStatus(devSub);
    } catch (err) {
      console.error('Checkout error:', err);
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
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Allow access if subscription active OR in trial
  if (subStatus?.active || trial.inTrial) {
    return (
      <>
        {trial.inTrial && !subStatus?.active && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: colors.sunny,
            color: colors.charcoal,
            textAlign: 'center',
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontFamily: fontStack,
            fontWeight: 600,
          }}>
            Free trial: {trial.daysRemaining} day{trial.daysRemaining !== 1 ? 's' : ''} remaining —{' '}
            <button
              type="button"
              onClick={handleCheckout}
              style={{
                background: 'none',
                border: 'none',
                color: colors.coral,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: fontStack,
                fontSize: '0.8rem',
                textDecoration: 'underline',
              }}
            >
              Subscribe now ($14.99/year)
            </button>
          </div>
        )}
        {children}
      </>
    );
  }

  // Paywall — trial expired and no active subscription
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
          Your free trial has ended. Subscribe to keep learning!
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
      </div>
    </div>
  );
}
