'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useWaitlist } from '@/components/WaitlistProvider';
import styles from './Header.module.css';

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
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <Link href="/" className={styles.logo}>
        <Image src="/icons/tomorrow-logo.svg" alt="Tomorrow" width={28} height={23} />
      </Link>

      <div className={styles.actions}>
        <button onClick={open} className={styles.joinBtn}>
          Join Waitlist
        </button>
      </div>
    </header>
  );
}
