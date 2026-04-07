'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { ScrollHighlightText } from '@/components/ScrollHighlightText';
import { StackCard } from '@/components/StackCard';
import { WaitlistButton } from '@/components/WaitlistButton';
import styles from './page.module.css';

const howItWorksSteps = [
  {
    number: '01',
    title: 'Fully onchain',
    description:
      'Blockchain-native credit financing eliminates the overhead of traditional lending via reduced origination costs, faster capital deployment, and more efficient loan servicing.',
  },
  {
    number: '02',
    title: 'Secured against future cash flows',
    description:
      'Creator revenue streams are tokenized as digital receivables. LPs hold a perfected security interest in the loan pool, providing enforceable protection in the event of borrower default.',
  },
  {
    number: '03',
    title: 'Specialized underwriting',
    description:
      'Rather than bootstrapping underwriting in-house, we partner with proven originators who have deep expertise and track records, so capital flows through the best operators, not around them.',
  },
];

export default function Home() {
  const [hiwVisible, setHiwVisible] = useState(false);
  const hiwRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHiwVisible(true); },
      { threshold: 0.1 }
    );
    if (hiwRef.current) observer.observe(hiwRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <Header />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroTextWrap}>
          <p className={styles.heroText}>
            Secured stablecoin lending for the creator economy.
            <br />
            <WaitlistButton className={styles.heroJoinBtn}>
              Join waitlist →
            </WaitlistButton>
          </p>
        </div>

        <div className={styles.heroCardWrap}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardBg} />
          </div>
        </div>
      </section>

      {/* Intro — scroll-revealed text */}
      <section className={styles.introSection}>
        <ScrollHighlightText
          text="Tomorrow issues digital creators onchain credit facilities secured against Google Adsense revenue, enabling access to affordable credit without selling content catalogues."
          className={styles.introText}
        />
      </section>

      {/* How It Works */}
      <section className={styles.hiwSection} ref={hiwRef}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>How it works</span>
          <div className={styles.dots}>
            <span className={`${styles.dot} ${styles.dotFilled}`} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        </div>

        <p className={styles.hiwHeadline}>
          Creator economy is systemically underserved by tradfi.{' '}
          <span className={styles.accent}>Tomorrow fills the gap.</span>
        </p>

        <div className={styles.hiwGrid}>
          {howItWorksSteps.map((step, i) => (
            <div
              key={step.number}
              className={`${styles.hiwCard} ${hiwVisible ? styles.hiwCardVisible : ''}`}
              style={{ transitionDelay: `${i * 110}ms` }}
            >
              <p className={styles.hiwCardNumber}>{step.number}</p>
              <div className={styles.hiwCardRule} />
              <p className={styles.hiwCardTitle}>{step.title}</p>
              <p className={styles.hiwCardDesc}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / Stack Cards */}
      <section className={styles.stackSection}>
        <div className={styles.stackInner}>
          <div className={styles.stackHeader}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Trust</span>
              <div className={styles.dots}>
                <span className={`${styles.dot} ${styles.dotFilled}`} />
                <span className={`${styles.dot} ${styles.dotFilled}`} />
                <span className={styles.dot} />
              </div>
            </div>
            <p className={styles.stackHeading}>Built for institutional capital</p>
          </div>

          <div className={styles.stackGrid}>
            <StackCard
              icon={<Image src="/icons/shield.svg" alt="" width={24} height={24} />}
              title="Professional Risk Management"
              description="We work with specialized originators and underwriters with a multi-year track record and deep relationships within the creator economy."
            />
            <StackCard
              icon={<Image src="/icons/clock.svg" alt="" width={24} height={24} />}
              title="Average Loan Duration"
              description="Creator loans range from 3-12 month contracts with strong protection rights and predictable repayment schedules."
            />
            <StackCard
              icon={<Image src="/icons/chart.svg" alt="" width={24} height={24} />}
              title="First-Loss Buffer"
              description="Originators and underwriters put skin in the game by providing first-loss capital before LP capital is touched when defaults occur."
            />
            <StackCard
              icon={<Image src="/icons/lock.svg" alt="" width={24} height={24} />}
              title="Default Rate"
              description={<>Historical default rate under 1%. Audited smart contracts and institutional-grade custody.</>}
            />
          </div>
        </div>
      </section>

      {/* For / Target Audience */}
      <section className={styles.forSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>For</span>
          <div className={styles.dots}>
            <span className={`${styles.dot} ${styles.dotFilled}`} />
            <span className={`${styles.dot} ${styles.dotFilled}`} />
            <span className={`${styles.dot} ${styles.dotFilled}`} />
          </div>
        </div>

        <p className={styles.forText}>
          Tomorrow is built for{' '}
          <span className={styles.forHighlight}>DeFi protocols</span> seeking real-world yield,{' '}
          <span className={styles.forHighlight}>institutional investors</span> diversifying exposure to the creator economy,{' '}
          <span className={styles.forHighlight}>credit underwriters and originators</span> looking to lower their cost of capital, and{' '}
          <span className={styles.forHighlight}>digital creators</span> requiring capital without selling their catalogues.{' '}
          <WaitlistButton className={styles.forJoinBtn}>
            Join waitlist →
          </WaitlistButton>
        </p>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerTop}>
            <nav className={styles.footerNav}>
              <a
                href="https://x.com/tomorrowloans"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                X (fka Twitter)
              </a>
            </nav>
            <span className={styles.footerCompany}>© {new Date().getFullYear()} Here &amp; Now Technologies, Inc.</span>
          </div>

          <p className={styles.footerLogoText}>TOMORROW</p>
        </div>
      </footer>
    </div>
  );
}
