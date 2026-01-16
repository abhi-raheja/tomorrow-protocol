import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { poolMetrics } from '@/lib/dummy-data';

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value}`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-200 mb-6">
                <div className="h-1.5 w-1.5 rounded-full bg-[#ff5900]" />
                <span className="text-sm font-medium text-[#ff5900]">Coming Soon</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-[6rem] sm:text-[7.5rem] lg:text-[9rem] font-bold text-[#15191e] tracking-tight leading-[0.9] mb-3">
                Financing
                <br />
                <span className="text-[#ff5900] whitespace-nowrap">the future</span>
              </h1>

              {/* Subheading */}
              <p className="text-2xl text-gray-600 max-w-xl mb-4 leading-relaxed">
                Bringing DeFi to traditionally underserved credit markets
              </p>

              {/* CTA Button */}
              <div className="flex">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#ff5900] hover:bg-[#e65000] text-white font-semibold px-10 h-14 text-lg"
                >
                  <Link href="/lp">Earn Now</Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Abstract Illustration */}
            <div className="hidden lg:flex items-center justify-center">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="border-t border-gray-100 bg-[#15191e]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div>
            <div className="text-2xl sm:text-3xl text-gray-400 font-medium mb-4">Assets under Management</div>
            <div className="text-8xl sm:text-9xl font-bold tracking-tight tabular-nums text-white">
              $100M
            </div>
          </div>
        </div>
      </section>

      {/* Everbloom Partner Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/everbloom-bg.jpg')`,
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 mb-8">
              <span className="text-lg font-medium text-white">In partnership with Everbloom</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Funding for Top Creators
            </h2>

            <p className="text-xl sm:text-2xl text-gray-200 mb-8 leading-relaxed">
              Everbloom gives creators the capital, tools and connections to grow their business.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#ff5900] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-100">Capped platform revenue share, creators always stay in control</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#ff5900] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-100">8-16 month contracts or shorter</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#ff5900] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-100">Creators keep 100% of their channel and IP</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#ff5900] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-100">Fast and flexible process</span>
              </div>
            </div>

            <a
              href="https://everbloom.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#ff5900] hover:text-[#ff7a33] font-semibold text-lg transition-colors"
            >
              Learn more about Everbloom
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#15191e] mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600">
              Simple, transparent, and designed for institutional capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              number="01"
              title="Deposit USDC"
              description="LPs deposit USDC into the protocol pool and receive pool shares representing their position."
            />
            <FeatureCard
              number="02"
              title="Fund Creators"
              description="Capital is deployed through Everbloom to provide advances to vetted content creators."
            />
            <FeatureCard
              number="03"
              title="Earn Yield"
              description="As creators repay their advances, yield is automatically distributed to LP positions."
            />
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Active Loans" value={formatNumber(poolMetrics.totalLoans)} />
            <StatCard label="Active Creators" value={formatNumber(poolMetrics.activeCreators)} />
            <StatCard label="Default Rate" value={`${poolMetrics.defaultRate}%`} trend="Low risk" />
            <StatCard label="Available Liquidity" value={formatCurrency(poolMetrics.liquidity)} />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#15191e] mb-6">
                Built for institutional capital
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Tomorrow Protocol brings institutional-grade infrastructure to creator financing.
                Real yields backed by real receivables, with full transparency and liquidity.
              </p>
              <div className="space-y-4">
                <TrustPoint text="Diversified creator portfolio reduces concentration risk" />
                <TrustPoint text="Real-time reporting and full transparency" />
                <TrustPoint text="Flexible liquidity with withdrawal queue" />
                <TrustPoint text="Audited smart contracts and institutional custody" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoCard label="Collection Rate" value="98.2%" />
              <InfoCard label="Avg Loan Duration" value="8 months" />
              <InfoCard label="Top 10 Concentration" value="28%" />
              <InfoCard label="Historical Default" value="<1%" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#15191e]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to earn?
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
            Join the protocol and start earning sustainable yield from creator financing.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#ff5900] hover:bg-[#e65000] text-white font-semibold px-8 h-12 text-base"
          >
            <Link href="/lp">Launch App</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <FooterLogo />
              <span className="text-lg font-semibold text-[#15191e]">Tomorrow Protocol</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Docs</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Twitter</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Discord</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">GitHub</a>
            </div>
            <p className="text-sm text-gray-400">
              Demo prototype
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MetricDisplay({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div className={`text-4xl sm:text-5xl font-bold tracking-tight mb-2 tabular-nums ${highlight ? 'text-[#ff5900]' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-sm text-gray-400 font-medium">{label}</div>
    </div>
  );
}

function FeatureCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="group p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all">
      <div className="text-sm text-[#ff5900] font-semibold mb-4">{number}</div>
      <h3 className="text-xl font-semibold text-[#15191e] mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="text-2xl sm:text-3xl font-bold text-[#15191e] tabular-nums mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
      {trend && <div className="text-xs text-green-600 font-medium mt-2">{trend}</div>}
    </div>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
        <svg className="h-3 w-3 text-[#ff5900]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
      <div className="text-2xl font-bold text-[#15191e] tabular-nums mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function FooterLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <circle cx="16" cy="16" r="16" fill="#ff5900" />
      <path
        d="M6 20 Q16 14 26 20"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="16" cy="14" r="5" fill="white" />
      <g stroke="white" strokeWidth="1.5" strokeLinecap="round">
        <line x1="16" y1="6" x2="16" y2="4" />
        <line x1="21" y1="9" x2="22.5" y2="7.5" />
        <line x1="23" y1="14" x2="25" y2="14" />
        <line x1="11" y1="9" x2="9.5" y2="7.5" />
        <line x1="9" y1="14" x2="7" y2="14" />
      </g>
      <path
        d="M16 28 L16 23 M13 25.5 L16 23 L19 25.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg aspect-square">
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background glow */}
        <defs>
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff5900" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ff5900" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sunriseGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ff5900" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#ff5900" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff7a33" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="pathGradient1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff5900" />
            <stop offset="100%" stopColor="#ff7a33" />
          </linearGradient>
          <linearGradient id="pathGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15191e" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
        </defs>

        {/* Soft glow background */}
        <circle cx="250" cy="250" r="200" fill="url(#glowGradient)" />

        {/* Rising sun / horizon */}
        <path
          d="M100 320 Q250 220 400 320"
          fill="url(#sunriseGradient)"
        />

        {/* Horizon line */}
        <path
          d="M80 320 Q250 240 420 320"
          stroke="#ff5900"
          strokeWidth="2"
          fill="none"
          strokeOpacity="0.3"
        />

        {/* Abstract rising curves - representing growth */}
        <path
          d="M120 380 Q180 300 250 280 Q320 260 380 200"
          stroke="url(#pathGradient1)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M140 400 Q200 340 270 320 Q340 300 400 260"
          stroke="url(#pathGradient2)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
        <path
          d="M100 360 Q160 280 230 260 Q300 240 360 180"
          stroke="#ff5900"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />

        {/* Central radiant sun element */}
        <circle cx="250" cy="200" r="60" fill="#ff5900" fillOpacity="0.1" />
        <circle cx="250" cy="200" r="45" fill="#ff5900" fillOpacity="0.15" />
        <circle cx="250" cy="200" r="30" fill="#ff5900" fillOpacity="0.2" />
        <circle cx="250" cy="200" r="18" fill="#ff5900" />

        {/* Radiating lines from sun */}
        <g stroke="#ff5900" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3">
          <line x1="250" y1="130" x2="250" y2="110" />
          <line x1="290" y1="140" x2="305" y2="125" />
          <line x1="320" y1="170" x2="340" y2="160" />
          <line x1="320" y1="210" x2="340" y2="220" />
          <line x1="210" y1="140" x2="195" y2="125" />
          <line x1="180" y1="170" x2="160" y2="160" />
          <line x1="180" y1="210" x2="160" y2="220" />
        </g>

        {/* Floating particles / stars */}
        <circle cx="150" cy="150" r="4" fill="#ff5900" fillOpacity="0.6" />
        <circle cx="350" cy="130" r="3" fill="#ff5900" fillOpacity="0.5" />
        <circle cx="380" cy="180" r="5" fill="#ff5900" fillOpacity="0.4" />
        <circle cx="120" cy="200" r="3" fill="#15191e" fillOpacity="0.3" />
        <circle cx="400" cy="280" r="4" fill="#15191e" fillOpacity="0.4" />
        <circle cx="100" cy="280" r="3" fill="#ff5900" fillOpacity="0.5" />
        <circle cx="320" cy="100" r="2" fill="#ff5900" fillOpacity="0.6" />
        <circle cx="180" cy="120" r="2" fill="#15191e" fillOpacity="0.4" />

        {/* Abstract connector nodes */}
        <circle cx="380" cy="200" r="8" fill="#15191e" />
        <circle cx="360" cy="180" r="6" fill="#ff5900" fillOpacity="0.8" />
        <circle cx="230" cy="260" r="6" fill="#15191e" fillOpacity="0.6" />
        <circle cx="270" cy="320" r="5" fill="#ff5900" fillOpacity="0.7" />

        {/* Upward arrow element - representing progress */}
        <path
          d="M430 300 L450 270 L470 300 M450 270 L450 340"
          stroke="#ff5900"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.6"
        />
      </svg>
    </div>
  );
}
