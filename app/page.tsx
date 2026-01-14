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
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-white/60">Live on Mainnet</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-white tracking-tight mb-6">
            Creator Financing
            <br />
            <span className="text-white/40">Onchain</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
            Institutional-grade yield from real-world creator receivables.
            Transparent, liquid, and built for the long term.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-medium px-8 h-12 text-base"
            >
              <Link href="/lp">Start Earning</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-white/20 text-white hover:bg-white/5 font-medium px-8 h-12 text-base"
            >
              <Link href="/lp">View Dashboard</Link>
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <MetricDisplay
              label="Total Value Locked"
              value={formatCurrency(poolMetrics.tvl)}
            />
            <MetricDisplay
              label="Current APY"
              value={`${poolMetrics.apy}%`}
              highlight
            />
            <MetricDisplay
              label="Pool Utilization"
              value={`${poolMetrics.utilization}%`}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-white/[0.08] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard label="Active Loans" value={formatNumber(poolMetrics.totalLoans)} />
            <StatCard label="Active Creators" value={formatNumber(poolMetrics.activeCreators)} />
            <StatCard label="Default Rate" value={`${poolMetrics.defaultRate}%`} />
            <StatCard label="Available Liquidity" value={formatCurrency(poolMetrics.liquidity)} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              How It Works
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Simple, transparent, and designed for institutional capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Trust Section */}
      <section className="border-t border-white/[0.08] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">
                Built for
                <br />
                Institutional Capital
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8">
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
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-emerald-500/10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
                Ready to Earn?
              </h2>
              <p className="text-white/50 max-w-xl mx-auto mb-8">
                Join the protocol and start earning sustainable yield from creator financing.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-medium px-8 h-12 text-base"
              >
                <Link href="/lp">Launch App</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-white">T</span>
              </div>
              <span className="text-lg font-medium text-white">Tomorrow Protocol</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Docs</a>
              <a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Twitter</a>
              <a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Discord</a>
              <a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">GitHub</a>
            </div>
            <p className="text-sm text-white/30">
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
      <div className={`text-4xl sm:text-5xl font-semibold tracking-tight mb-2 tabular-nums ${highlight ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-sm text-white/40">{label}</div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-semibold text-white tabular-nums mb-1">
        {value}
      </div>
      <div className="text-sm text-white/40">{label}</div>
    </div>
  );
}

function FeatureCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all">
      <div className="text-sm text-white/30 font-medium mb-4">{number}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-white/50 leading-relaxed">{description}</p>
    </div>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-white/70">{text}</span>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.08]">
      <div className="text-2xl font-semibold text-white tabular-nums mb-1">{value}</div>
      <div className="text-sm text-white/40">{label}</div>
    </div>
  );
}
