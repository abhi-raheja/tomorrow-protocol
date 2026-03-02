'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useWaitlist } from '@/components/WaitlistProvider';

export function Header() {
  const { open } = useWaitlist();
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: '64px',
      padding: '0 24px',
      background: scrolled ? 'rgba(245, 245, 245, 0.7)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-bottom 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <TomorrowLogo />
      </Link>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={open}
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#fff',
            padding: '6px 16px',
            border: '1px solid #000',
            borderRadius: '100px',
            background: '#000',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Join Waitlist
        </button>
      </div>
    </header>
  );
}

function TomorrowLogo() {
  return (
    <svg width="28" height="23" viewBox="0 0 113 92" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M103.84 76.0151C106.138 76.0151 108 78.2537 108 81.0151C108 83.7766 106.138 86.0151 103.84 86.0151H9.15994C6.86247 86.0151 5 83.7766 5 81.0151C5 78.2537 6.86247 76.0151 9.15994 76.0151H103.84Z" stroke="#ff5900" strokeWidth="10" strokeLinecap="round"/>
      <path d="M101.563 5.81087C103.486 4.33664 106.064 4.96947 107.321 7.22438C108.579 9.47931 108.039 12.5025 106.116 13.9767L56.5 52.0151L6.88396 13.9767C4.96105 12.5025 4.42139 9.47931 5.67857 7.22438C6.93577 4.96947 9.51384 4.33664 11.4368 5.81087L56.5 40.3587L101.563 5.81087Z" stroke="#ff5900" strokeWidth="10" strokeLinecap="round"/>
    </svg>
  );
}
