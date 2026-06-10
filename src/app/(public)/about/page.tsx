import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About Us | Truck King Hub',
    description:
      'Truck King Hub is a daily intelligence platform for owner-operators and small fleet owners — covering FMCSA updates, compliance, insurance, and freight trends.',
  };
}

export default function AboutPage() {
  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

        {/* Hero */}
        <h1
          className="text-4xl sm:text-5xl mb-4 uppercase"
          style={{ fontFamily: 'Impact, sans-serif', color: '#F5C518' }}
        >
          About Truck King Hub
        </h1>
        <p className="text-lg mb-12" style={{ color: '#d1d5db' }}>
          The daily intelligence platform built for the people who keep America moving.
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { value: '10,000+', label: 'Monthly Readers' },
            { value: '5', label: 'Content Categories' },
            { value: 'Daily', label: 'Updates' },
            { value: 'Free', label: 'Forever' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg p-5 text-center"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
            >
              <div
                className="text-3xl font-black mb-1"
                style={{ color: '#F5C518', fontFamily: 'Impact, sans-serif' }}
              >
                {stat.value}
              </div>
              <div className="text-sm uppercase tracking-wide" style={{ color: '#9ca3af' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Who We Are */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ background: '#F5C518', width: 4, height: 28, display: 'inline-block', borderRadius: 2 }} />
            <h2
              className="text-2xl font-bold uppercase"
              style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
            >
              Who We Are
            </h2>
          </div>
          <p className="leading-relaxed mb-4" style={{ color: '#d1d5db' }}>
            Truck King Hub is a daily intelligence platform for owner-operators and small fleet owners across the
            United States. We exist because the trucking industry moves too fast — regulations shift, freight markets
            swing, and compliance deadlines don&apos;t wait. We track it all so you don&apos;t have to.
          </p>
          <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
            Whether you run one truck or twenty-five, staying informed is part of running a profitable, compliant
            operation. That&apos;s the gap we fill — actionable, plainly written intelligence delivered every day,
            free of charge.
          </p>
        </section>

        {/* What We Cover */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ background: '#F5C518', width: 4, height: 28, display: 'inline-block', borderRadius: 2 }} />
            <h2
              className="text-2xl font-bold uppercase"
              style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
            >
              What We Cover
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: 'FMCSA Updates',
                desc: 'Regulatory changes, enforcement priorities, and rule-making that affect your operating authority.',
              },
              {
                title: 'Compliance',
                desc: 'HOS rules, ELD mandates, drug & alcohol testing, CDL requirements, and inspection readiness.',
              },
              {
                title: 'Insurance Intel',
                desc: 'Coverage requirements, rate trends, claim tips, and what insurers are watching in the trucking space.',
              },
              {
                title: 'Freight Trends',
                desc: 'Spot rates, lane demand, load board dynamics, and market signals that affect your bottom line.',
              },
              {
                title: 'Trucks & Equipment',
                desc: 'New equipment news, maintenance guidance, technology, and ownership cost analysis.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg p-5"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
              >
                <h3 className="font-bold mb-2 uppercase text-sm tracking-wide" style={{ color: '#F5C518' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ background: '#F5C518', width: 4, height: 28, display: 'inline-block', borderRadius: 2 }} />
            <h2
              className="text-2xl font-bold uppercase"
              style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
            >
              Our Mission
            </h2>
          </div>
          <p className="leading-relaxed mb-4" style={{ color: '#d1d5db' }}>
            Our mission is simple: give independent trucking professionals access to the same quality of industry
            intelligence that larger fleets and carriers take for granted. No paywalls. No spam. No agenda other than
            accuracy.
          </p>
          <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
            We believe that a well-informed owner-operator is a more competitive, safer, and more profitable one.
            Every article we publish is written with that reader in mind.
          </p>
        </section>

        {/* Editorial Standards */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ background: '#F5C518', width: 4, height: 28, display: 'inline-block', borderRadius: 2 }} />
            <h2
              className="text-2xl font-bold uppercase"
              style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
            >
              Editorial Standards
            </h2>
          </div>
          <p className="leading-relaxed mb-4" style={{ color: '#d1d5db' }}>
            We hold ourselves to a straightforward set of editorial commitments:
          </p>
          <ul className="space-y-3">
            {[
              'All content is original writing — we do not republish, scrape, or repost content from other outlets.',
              'Facts, figures, and regulatory citations are sourced from primary sources: FMCSA, DOT, ATRI, FreightWaves data, and official government publications.',
              'Sponsored content is clearly labeled. Editorial coverage is never for sale.',
              'We correct errors promptly. If you spot a factual mistake, contact us at info@truckkinghub.com.',
              'We do not publish rumors, unverified claims, or speculative pricing as fact.',
            ].map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
                <span style={{ color: '#F5C518', flexShrink: 0, marginTop: 2 }}>▸</span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        {/* Team Note */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ background: '#F5C518', width: 4, height: 28, display: 'inline-block', borderRadius: 2 }} />
            <h2
              className="text-2xl font-bold uppercase"
              style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
            >
              The Team
            </h2>
          </div>
          <p className="leading-relaxed mb-4" style={{ color: '#d1d5db' }}>
            Truck King Hub is run by a small, dedicated team of writers, editors, and logistics researchers who are
            passionate about the trucking industry. We are not a large media conglomerate. We are independent, focused,
            and accountable directly to our readers.
          </p>
          <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
            Our contributors have backgrounds spanning commercial trucking operations, transportation law, insurance
            brokerage, and freight logistics. We write what we know — and we verify what we don&apos;t.
          </p>
        </section>

        {/* CTA */}
        <div
          className="rounded-lg p-8 text-center"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
        >
          <h3
            className="text-xl mb-3 uppercase"
            style={{ fontFamily: 'Impact, sans-serif', color: '#F5C518' }}
          >
            Ready to Stay Ahead?
          </h3>
          <p className="mb-6 text-sm" style={{ color: '#d1d5db' }}>
            Browse our free resource library, compliance guides, and daily trucking news.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resources"
              className="inline-block px-8 py-3 rounded font-black uppercase text-sm tracking-widest"
              style={{ background: '#F5C518', color: '#0d0d0d' }}
            >
              Browse Resources
            </Link>
            <a
              href="mailto:info@truckkinghub.com"
              className="inline-block px-8 py-3 rounded font-bold uppercase text-sm tracking-wide"
              style={{ border: '1px solid #F5C518', color: '#F5C518' }}
            >
              Contact Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
