'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <Link href="/" className={styles.logo}>
        <Image src={`${basePath}/icons/tomorrow-logo-white.svg`} alt="Tomorrow" width={34} height={28} />
        <span className={styles.logoText}>Tomorrow</span>
      </Link>
    </header>
  );
}
