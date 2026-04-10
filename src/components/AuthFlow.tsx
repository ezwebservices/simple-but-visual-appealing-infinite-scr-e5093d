import { useState, useCallback } from 'react';
import { signUp, confirmSignUp, signIn, resetPassword, confirmResetPassword, type SignInOutput } from 'aws-amplify/auth';
import { colors, fontStack } from '../styles/theme';

type AuthStep = 'signUp' | 'verify' | 'signIn' | 'forgot' | 'forgotConfirm' | 'complete';

interface AuthFlowProps {
  onAuthenticated: () => void;
}

export default function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const [step, setStep] = useState<AuthStep>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });
      setStep('verify');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }, [email, password, name]);

  const handleVerify = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      // Auto sign-in after verification
      const result: SignInOutput = await signIn({ username: email, password });
      if (result.isSignedIn) {
        onAuthenticated();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  }, [email, password, code, onAuthenticated]);

  const handleSignIn = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const result: SignInOutput = await signIn({ username: email, password });
      if (result.isSignedIn) {
        onAuthenticated();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }, [email, password, onAuthenticated]);

  // ── Password reset: request the code (Cognito emails it) ──
  const handleForgot = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      await resetPassword({ username: email });
      setStep('forgotConfirm');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not start password reset');
    } finally {
      setLoading(false);
    }
  }, [email]);

  // ── Password reset: confirm the code + new password, then sign in ──
  const handleForgotConfirm = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: password,
      });
      const result: SignInOutput = await signIn({ username: email, password });
      if (result.isSignedIn) {
        onAuthenticated();
      } else {
        setStep('signIn');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setLoading(false);
    }
  }, [email, code, password, onAuthenticated]);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '2px solid rgba(0,0,0,0.1)',
    fontSize: '1rem',
    fontFamily: fontStack,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: colors.mint,
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 700,
    fontFamily: fontStack,
    cursor: loading ? 'wait' : 'pointer',
    opacity: loading ? 0.7 : 1,
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: `linear-gradient(180deg, ${colors.cream}, ${colors.peach}40)`,
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
        maxWidth: 400,
        width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
      }}>
        {/* Logo / Title */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: colors.coral }}>
            NumPals
          </h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(0,0,0,0.5)', fontSize: '0.9rem' }}>
            Swipe, Count, Roar!
          </p>
        </div>

        {step === 'signIn' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: colors.charcoal }}>Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)', margin: 0 }}>
              <button
                type="button"
                onClick={() => { setStep('forgot'); setError(''); }}
                style={{ background: 'none', border: 'none', color: colors.mint, fontWeight: 600, cursor: 'pointer', fontFamily: fontStack, fontSize: '0.85rem' }}
              >
                Forgot password?
              </button>
            </p>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)', margin: 0 }}>
              No account?{' '}
              <button
                type="button"
                onClick={() => { setStep('signUp'); setError(''); }}
                style={{ background: 'none', border: 'none', color: colors.mint, fontWeight: 700, cursor: 'pointer', fontFamily: fontStack, fontSize: '0.85rem' }}
              >
                Create one
              </button>
            </p>
          </form>
        )}

        {step === 'forgot' && (
          <form onSubmit={(e) => { e.preventDefault(); handleForgot(); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: colors.charcoal }}>Reset Password</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)' }}>
              Enter your email and we'll send you a code to reset your password.
            </p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)', margin: 0 }}>
              <button
                type="button"
                onClick={() => { setStep('signIn'); setError(''); }}
                style={{ background: 'none', border: 'none', color: colors.mint, fontWeight: 700, cursor: 'pointer', fontFamily: fontStack, fontSize: '0.85rem' }}
              >
                Back to sign in
              </button>
            </p>
          </form>
        )}

        {step === 'forgotConfirm' && (
          <form onSubmit={(e) => { e.preventDefault(); handleForgotConfirm(); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: colors.charcoal }}>Set New Password</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)' }}>
              Check <strong>{email}</strong> for a verification code.
            </p>
            <input
              type="text"
              placeholder="Verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              style={inputStyle}
              autoComplete="one-time-code"
            />
            <input
              type="password"
              placeholder="New password (8+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)', margin: 0 }}>
              <button
                type="button"
                onClick={() => { setStep('signIn'); setError(''); }}
                style={{ background: 'none', border: 'none', color: colors.mint, fontWeight: 700, cursor: 'pointer', fontFamily: fontStack, fontSize: '0.85rem' }}
              >
                Cancel
              </button>
            </p>
          </form>
        )}

        {step === 'signUp' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: colors.charcoal }}>Create Account</h2>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password (8+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)', margin: 0 }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setStep('signIn'); setError(''); }}
                style={{ background: 'none', border: 'none', color: colors.mint, fontWeight: 700, cursor: 'pointer', fontFamily: fontStack, fontSize: '0.85rem' }}
              >
                Sign in
              </button>
            </p>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: colors.charcoal }}>Verify Email</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)' }}>
              We sent a code to <strong>{email}</strong>
            </p>
            <input
              type="text"
              placeholder="Verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              style={inputStyle}
              autoComplete="one-time-code"
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>
        )}

        {error && (
          <p style={{
            marginTop: 12,
            padding: '10px 14px',
            borderRadius: '8px',
            background: `${colors.coral}15`,
            color: colors.coral,
            fontSize: '0.85rem',
            margin: '12px 0 0',
          }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
