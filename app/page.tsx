'use client';

import { Header } from '@/components/layout/Header';
import { useWaitlist } from '@/components/WaitlistProvider';
import { ScrollHighlightText } from '@/components/ScrollHighlightText';

export default function Home() {
  const { open } = useWaitlist();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <Header />

      {/* Hero */}
      <section style={{ padding: '128px 0 0', display: 'flex', flexDirection: 'column', gap: '64px' }}>
        <div style={{ padding: '0 72px' }}>
          <p style={{ fontSize: '36px', lineHeight: 1, letterSpacing: '-0.04em', color: '#000' }}>
            Secured stablecoin lending for the creator economy.
            <br />
            <button onClick={open} style={{ font: 'inherit', letterSpacing: '-0.04em', color: '#ff5900', background: 'none', border: 'none', padding: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Join waitlist →
            </button>
          </p>
        </div>

        {/* Calculator / Showcase Card */}
        <div style={{ width: '100%', padding: '0 48px' }}>
          <div style={{
            width: '100%',
            position: 'relative',
            aspectRatio: '16/10',
            borderRadius: '48px',
            overflow: 'hidden',
            backgroundColor: '#15191e',
          }}>
            {/* Background image */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('/images/hero-bg.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.4,
            }} />

          </div>
        </div>
      </section>

      {/* Intro / Value Prop — scroll-revealed text */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '128px 48px' }}>
        <ScrollHighlightText
          text="Tomorrow issues digital creators onchain credit facilities secured against Google Adsense revenue, enabling access to affordable credit without selling content catalogues."
          style={{
            fontSize: '72px',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        />
      </section>

      {/* Design Section — sticky left + scrolling right features */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '128px 48px' }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '24px',
          marginBottom: '64px',
          borderTop: '1px solid #000',
        }}>
          <span style={{ fontSize: '16px', fontWeight: 500, color: '#000', letterSpacing: '-0.04em' }}>How it works</span>
          <div style={{ display: 'flex', gap: '2px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#000', display: 'inline-block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.4)', display: 'inline-block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.4)', display: 'inline-block' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '96px' }}>
          {/* Left — Sticky description */}
          <div style={{ flex: 2, position: 'sticky', top: '128px', alignSelf: 'flex-start' }}>
            <p style={{ fontSize: '48px', lineHeight: 1, letterSpacing: '-0.04em', color: '#000' }}>
              Creator economy is systemically underserved by tradfi. <span style={{ color: '#ff5900' }}>Tomorrow fills the gap.</span>
            </p>
          </div>

          {/* Right — Scrolling features */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '96px', paddingTop: '50vh' }}>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#000', marginBottom: '4px' }}>Fully onchain</p>
              <p style={{ fontSize: '16px', color: 'rgba(0,0,0,0.5)' }}>Blockchain-native credit financing eliminates the overhead of traditional lending via reduced origination costs, faster capital deployment, and more efficient loan servicing.</p>
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#000', marginBottom: '4px' }}>Secured against future cash flows</p>
              <p style={{ fontSize: '16px', color: 'rgba(0,0,0,0.5)' }}>Creator revenue streams are tokenized as digital receivables. LPs hold a perfected security interest in the loan pool, providing enforceable protection in the event of borrower default.</p>
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#000', marginBottom: '4px' }}>Specialized underwriting</p>
              <p style={{ fontSize: '16px', color: 'rgba(0,0,0,0.5)' }}>Rather than bootstrapping underwriting in-house, we partner with proven originators who have deep expertise and track records, so capital flows through the best operators, not around them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stack Section — 4 cards */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '128px 48px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '24px',
              marginBottom: '64px',
              borderTop: '1px solid #000',
            }}>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#000', letterSpacing: '-0.04em' }}>Trust</span>
              <div style={{ display: 'flex', gap: '2px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#000', display: 'inline-block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#000', display: 'inline-block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.4)', display: 'inline-block' }} />
              </div>
            </div>

            <div style={{ width: '60%' }}>
              <p style={{ fontSize: '48px', lineHeight: 1, letterSpacing: '-0.04em', color: '#000' }}>
                Built for institutional capital
              </p>
            </div>
          </div>

          {/* 4 Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <StackCard
              icon={<ShieldIcon />}
              title="Professional Risk Management"
              description="We work with specialized originators and underwriters with a multi-year track record and deep relationships within the creator economy."
            />
            <StackCard
              icon={<ClockIcon />}
              title="Average Loan Duration"
              description="Creator loans range from 3-12 month contracts with strong protection rights and predictable repayment schedules."
            />
            <StackCard
              icon={<ChartIcon />}
              title="First-Loss Buffer"
              description="Originators and underwriters put skin in the game by providing first-loss capital before LP capital is touched when defaults occur."
            />
            <StackCard
              icon={<LockIcon />}
              title="Default Rate"
              description={<>Historical default rate under 1%. Audited smart contracts and institutional-grade custody.</>}
            />
          </div>
        </div>
      </section>

      {/* Borrowers / Target section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '128px 48px 256px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '24px',
          marginBottom: '64px',
          borderTop: '1px solid #000',
        }}>
          <span style={{ fontSize: '16px', fontWeight: 500, color: '#000', letterSpacing: '-0.04em' }}>For</span>
          <div style={{ display: 'flex', gap: '2px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#000', display: 'inline-block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#000', display: 'inline-block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#000', display: 'inline-block' }} />
          </div>
        </div>

        <p style={{ fontSize: '48px', lineHeight: 1, letterSpacing: '-0.04em', color: 'rgba(0,0,0,0.5)' }}>
          Tomorrow is built for{' '}
          <span style={{ color: '#000' }}>DeFi protocols</span> seeking real-world yield,{' '}
          <span style={{ color: '#000' }}>institutional investors</span> diversifying exposure to the creator economy,{' '}
          <span style={{ color: '#000' }}>credit underwriters and originators</span> looking to lower their cost of capital, and{' '}
          <span style={{ color: '#000' }}>digital creators</span> requiring capital without selling their catalogues.{' '}
          <button onClick={open} style={{ font: 'inherit', letterSpacing: '-0.04em', color: '#ff5900', background: 'none', border: 'none', padding: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Join waitlist →
          </button>
        </p>
      </section>

      {/* Footer — logos marquee + nav */}
      <footer style={{ backgroundColor: '#ff5900', display: 'flex', flexDirection: 'column' }}>

        {/* Footer content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '128px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a href="https://x.com/tomorrowloans" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: '16px', textDecoration: 'none' }}>X (fka Twitter)</a>
            </nav>
            <span style={{ color: '#fff', fontSize: '16px' }}>Tomorrow Protocol &copy; 2026</span>
          </div>

          {/* Large logo text */}
          <div style={{ width: '100%' }}>
            <p style={{
              fontSize: 'clamp(48px, 12vw, 160px)',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.15)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}>
              TOMORROW
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Stack Card ─── */
function StackCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: React.ReactNode }) {
  return (
    <div style={{
      borderRadius: '16px',
      backgroundColor: '#fff',
      aspectRatio: '3/4',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        border: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000',
      }}>
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '18px', color: '#000', letterSpacing: '-0.02em', fontWeight: 500, minHeight: '44px' }}>{title}</p>
        <p style={{ fontSize: '16px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.5, minHeight: '120px' }}>{description}</p>
      </div>
    </div>
  );
}

/* ─── Icons ─── */
function ShieldIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}
