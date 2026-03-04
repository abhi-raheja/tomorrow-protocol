'use client';

import { useState } from 'react';

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

type ModalStep = 'form' | 'verify' | 'success';

export function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [xHandle, setXHandle] = useState('');
  const [website, setWebsite] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<ModalStep>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(false);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim();
    const normalizedXHandle = xHandle.trim();

    if (!normalizedEmail) {
      setError('Email is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          xHandle: normalizedXHandle,
          website,
        }),
      });

      let responseBody: { error?: string; pendingVerification?: boolean } | null = null;
      try {
        responseBody = (await res.json()) as { error?: string; pendingVerification?: boolean };
      } catch {
        responseBody = null;
      }

      if (!res.ok) {
        throw new Error(responseBody?.error || 'Unable to submit right now. Please try again.');
      }

      if (responseBody?.pendingVerification) {
        setStep('verify');
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to submit right now. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedCode = code.trim();
    if (!trimmedCode || trimmedCode.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/waitlist/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: trimmedCode,
        }),
      });

      let responseBody: { error?: string; success?: boolean } | null = null;
      try {
        responseBody = (await res.json()) as { error?: string; success?: boolean };
      } catch {
        responseBody = null;
      }

      if (!res.ok) {
        throw new Error(responseBody?.error || 'Verification failed. Please try again.');
      }

      setStep('success');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Verification failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown) return;

    setError('');
    setResendCooldown(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          xHandle: xHandle.trim(),
          website,
        }),
      });

      let responseBody: { error?: string } | null = null;
      try {
        responseBody = (await res.json()) as { error?: string };
      } catch {
        responseBody = null;
      }

      if (!res.ok) {
        throw new Error(responseBody?.error || 'Unable to resend code. Please try again.');
      }

      setCode('');
    } catch (resendError) {
      setError(
        resendError instanceof Error
          ? resendError.message
          : 'Unable to resend code. Please try again.'
      );
    } finally {
      // 30-second cooldown between resends
      setTimeout(() => setResendCooldown(false), 30_000);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setEmail('');
      setXHandle('');
      setWebsite('');
      setCode('');
      setStep('form');
      setError('');
      setResendCooldown(false);
    }, 200);
  };

  if (!open) return null;

  const inputStyle = {
    fontSize: '16px',
    color: '#000',
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '12px',
    padding: '14px 16px',
    outline: 'none',
    fontFamily: 'inherit',
  } as const;

  const buttonStyle = {
    padding: '14px 16px',
    background: '#ff5900',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 500,
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    opacity: isSubmitting ? 0.5 : 1,
    fontFamily: 'inherit',
  } as const;

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(245,245,245,0.7)',
        backdropFilter: 'blur(48px)',
        WebkitBackdropFilter: 'blur(48px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        animation: 'fadeIn 0.2s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          margin: '0 24px',
          padding: '24px',
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.05)',
          borderRadius: '24px',
          cursor: 'default',
          animation: 'slideUp 0.2s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close waitlist modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            background: 'none',
            border: 'none',
            fontSize: '16px',
            color: 'rgba(0,0,0,0.3)',
            cursor: 'pointer',
          }}
        >
          &#x2715;
        </button>

        {step === 'success' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center', padding: '24px 0 0' }}>
            <p style={{ fontSize: '24px', fontWeight: 600, color: '#000', letterSpacing: '-0.02em' }}>
              You&apos;re on the list
            </p>
            <p style={{ fontSize: '16px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.5 }}>
              We&apos;ll reach out when it&apos;s your turn. Follow us on X for updates.
            </p>
            <button
              onClick={handleClose}
              style={{
                marginTop: '8px',
                ...buttonStyle,
                cursor: 'pointer',
                opacity: 1,
              }}
            >
              Done
            </button>
          </div>
        ) : step === 'verify' ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
              <p style={{ fontSize: '24px', fontWeight: 600, color: '#000', letterSpacing: '-0.02em' }}>
                Check your email
              </p>
              <p style={{ fontSize: '16px', lineHeight: 1.5, color: 'rgba(0,0,0,0.5)' }}>
                We sent a 6-digit code to{' '}
                <span style={{ color: '#000', fontWeight: 500 }}>{email.trim()}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>
                  Verification code
                </label>
                <input
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(val);
                  }}
                  maxLength={6}
                  autoFocus
                  style={{
                    ...inputStyle,
                    letterSpacing: '8px',
                    fontSize: '24px',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                />
              </div>

              {error && (
                <p style={{ fontSize: '14px', color: '#e53e3e', margin: '-8px 0 0' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || code.length !== 6}
                style={{
                  ...buttonStyle,
                  cursor: isSubmitting || code.length !== 6 ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting || code.length !== 6 ? 0.5 : 1,
                }}
              >
                {isSubmitting ? 'Verifying...' : 'Verify'}
              </button>

              <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)', textAlign: 'center', margin: '-8px 0 0' }}>
                Didn&apos;t get the code?{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendCooldown ? 'rgba(0,0,0,0.3)' : '#ff5900',
                    cursor: resendCooldown ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                    fontFamily: 'inherit',
                    textDecoration: 'underline',
                  }}
                >
                  {resendCooldown ? 'Code sent' : 'Resend code'}
                </button>
              </p>
            </form>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
              <p style={{ fontSize: '24px', fontWeight: 600, color: '#000', letterSpacing: '-0.02em' }}>
                Join the waitlist
              </p>
              <p style={{ fontSize: '16px', lineHeight: 1.5, color: 'rgba(0,0,0,0.5)' }}>
                Be the first to access Tomorrow Protocol when we launch.
              </p>
            </div>

            <form onSubmit={handleSubmitEmail} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Honeypot field */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  top: 0,
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              >
                <label htmlFor="waitlist-website">Website</label>
                <input
                  id="waitlist-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  maxLength={254}
                  required
                  aria-invalid={error ? 'true' : 'false'}
                  style={inputStyle}
                />
              </div>

              {/* X Handle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>
                  X (Twitter) <span style={{ color: 'rgba(0,0,0,0.3)', fontWeight: 400 }}>optional</span>
                </label>
                <input
                  name="xHandle"
                  type="text"
                  placeholder="@handle"
                  value={xHandle}
                  onChange={(e) => setXHandle(e.target.value)}
                  autoComplete="off"
                  maxLength={16}
                  style={inputStyle}
                />
              </div>

              {error && (
                <p style={{ fontSize: '14px', color: '#e53e3e', margin: '-8px 0 0' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={buttonStyle}
              >
                {isSubmitting ? 'Submitting...' : 'Join waitlist'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
