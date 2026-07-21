'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { ScrollHighlightText } from '@/components/ScrollHighlightText';
import styles from './page.module.css';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const howItWorksSteps = [
  {
    title: 'Fully onchain',
    description:
      'Blockchain-native credit financing eliminates the overhead of traditional lending via reduced origination costs, faster capital deployment, and more efficient loan servicing.',
  },
  {
    title: 'Secured against future cash flows',
    description:
      'Creator revenue streams are tokenized as digital receivables. LPs hold a perfected security interest in the loan pool, providing enforceable protection in the event of borrower default.',
  },
  {
    title: 'Specialized underwriting',
    description:
      'Rather than bootstrapping underwriting in-house, we partner with proven originators who have deep expertise and track records, so capital flows through the best operators, not around them.',
  },
];

const trustCards = [
  {
    icon: 'shield.svg',
    title: 'Professional Risk Management',
    description:
      'We work with specialized originators and underwriters with a multi-year track record and deep relationships within the creator economy.',
  },
  {
    icon: 'clock.svg',
    title: 'Average Loan Duration',
    description:
      'Creator loans range from 3-12 month contracts with strong protection rights and predictable repayment schedules.',
  },
  {
    icon: 'chart.svg',
    title: 'First-Loss Buffer',
    description:
      'Originators and underwriters put skin in the game by providing first-loss capital before LP capital is touched when defaults occur.',
  },
  {
    icon: 'lock.svg',
    title: 'Default Rate',
    description:
      'Historically very low default rates. Audited smart contracts and institutional-grade custody.',
  },
];

export default function Home() {
  const [hiwVisible, setHiwVisible] = useState(false);
  const [trustVisible, setTrustVisible] = useState(false);
  const hiwRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === hiwRef.current) setHiwVisible(true);
            if (entry.target === trustRef.current) setTrustVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (hiwRef.current) observer.observe(hiwRef.current);
    if (trustRef.current) observer.observe(trustRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <Header />

      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div
            className={styles.heroBgImage}
            style={{ backgroundImage: `url('${basePath}/images/hero-bg.jpg')` }}
          />
          <div className={styles.heroBgOverlay} />
        </div>

        <div className={styles.heroContent}>
          <p className={styles.scrollHint}>/ Scroll down</p>

          <div className={styles.heroTextBlock}>
            <h1 className={styles.heroHeadline}>
              Secured Stablecoin Lending<br />
              for the Creator Economy.
            </h1>

            <div className={styles.heroActions}>
              <span className={styles.heroComingSoon}>Coming Q3 2026</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─── About / What ─── */}
      <section className={styles.aboutSection} id="about">
        <div className={styles.aboutInner}>
          <h5 className={styles.sectionLabel}>WHAT</h5>
          <div className={styles.aboutDivider} />
          <ScrollHighlightText
            text="Tomorrow issues digital creators onchain credit facilities secured against Google Adsense revenue, enabling access to affordable credit without selling content catalogues."
            className={styles.aboutHeadline}
          />
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className={styles.hiwSection} id="how-it-works" ref={hiwRef}>
        <div className={styles.hiwInner}>
          <div className={styles.hiwLeft}>
            <h5 className={styles.sectionLabel}>HOW IT WORKS</h5>
            <h2 className={styles.hiwHeadline}>
              Creator economy is systemically underserved by tradfi.{' '}
              <span className={styles.accentOrange}>Tomorrow fills the gap.</span>
            </h2>
          </div>

          <div className={styles.hiwRight}>
            <div className={styles.hiwCards}>
              {howItWorksSteps.map((step, i) => (
                <div
                  key={step.title}
                  className={`${styles.hiwCard} ${hiwVisible ? styles.hiwCardVisible : ''}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <h3 className={styles.hiwCardTitle}>{step.title}</h3>
                  <p className={styles.hiwCardDesc}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust / Stack Cards ─── */}
      <section className={styles.trustSection} id="trust" ref={trustRef}>
        <div className={styles.trustInner}>
          <div className={styles.trustHeader}>
            <h5 className={styles.sectionLabel}>TRUST</h5>
            <h2 className={styles.trustHeadline}>
              Built for institutional capital
            </h2>
          </div>

          <div className={styles.trustGrid}>
            {trustCards.map((card, i) => (
              <div
                key={card.title}
                className={`${styles.trustCard} ${trustVisible ? styles.trustCardVisible : ''}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={styles.trustCardIcon}>
                  <Image src={`${basePath}/icons/${card.icon}`} alt="" width={24} height={24} />
                </div>
                <h3 className={styles.trustCardTitle}>{card.title}</h3>
                <p className={styles.trustCardDesc}>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── For / Target Audience ─── */}
      <section className={styles.forSection}>
        <div className={styles.forInner}>
          <h5 className={styles.sectionLabel}>FOR</h5>
          <div className={styles.forDivider} />
          <p className={styles.forText}>
            Tomorrow is built for <span className={styles.forHighlight}>DeFi protocols</span> seeking real-world yield, <span className={styles.forHighlight}>institutional investors</span> diversifying exposure to the creator economy, <span className={styles.forHighlight}>credit underwriters and originators</span> looking to lower their cost of capital, and <span className={styles.forHighlight}>digital creators</span> requiring capital without selling their catalogues.
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerLeft}>
            <div className={styles.footerBrand}>
              <Image src={`${basePath}/icons/tomorrow-logo-white.svg`} alt="Tomorrow" width={34} height={28} />
              <span className={styles.footerBrandName}>Tomorrow</span>
            </div>
          </div>

          <div className={styles.footerRight}>
            <p className={styles.footerNavLabel}>Connect</p>
            <nav className={styles.footerNav}>
              <a href="https://x.com/tmrwfinance" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>X / Twitter</a>
              <a href="https://www.linkedin.com/company/tmrwfinance" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>LinkedIn</a>
            </nav>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span className={styles.footerCopyright}>
            &copy; {new Date().getFullYear()} Here &amp; Now Technologies, Inc. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
