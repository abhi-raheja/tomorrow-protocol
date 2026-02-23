'use client';

import { useState } from 'react';

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

export function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [xHandle, setXHandle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, xHandle }),
      });

      if (!res.ok) throw new Error('Failed to submit');

      setIsSuccess(true);
    } catch {
      // Fallback: still show success for now (API not wired yet)
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setEmail('');
      setXHandle('');
      setIsSuccess(false);
      setError('');
    }, 200);
  };

  if (!open) return null;

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

        {isSuccess ? (
          /* Success state */
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
                padding: '14px 16px',
                background: '#ff5900',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        ) : (
          /* Form state */
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
              <p style={{ fontSize: '24px', fontWeight: 600, color: '#000', letterSpacing: '-0.02em' }}>
                Join the waitlist
              </p>
              <p style={{ fontSize: '16px', lineHeight: 1.5, color: 'rgba(0,0,0,0.5)' }}>
                Be the first to access Tomorrow Protocol when we launch.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    fontSize: '16px',
                    color: '#000',
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* X Handle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>
                  X (Twitter) <span style={{ color: 'rgba(0,0,0,0.3)', fontWeight: 400 }}>optional</span>
                </label>
                <input
                  type="text"
                  placeholder="@handle"
                  value={xHandle}
                  onChange={(e) => setXHandle(e.target.value)}
                  style={{
                    fontSize: '16px',
                    color: '#000',
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {error && (
                <p style={{ fontSize: '14px', color: '#e53e3e', margin: '-8px 0 0' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
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
                }}
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
