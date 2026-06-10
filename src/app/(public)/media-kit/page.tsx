import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Media Kit & Advertising | Truck King Hub',
    description:
      'Advertise with Truck King Hub. Reach 10,000+ monthly readers in the owner-operator and small fleet market. View ad placements, audience demographics, and rates.',
  };
}

const adPlacements = [
  { placement: 'Homepage Leaderboard', size: '728×90', format: 'Display', rate: '$299/mo', notes: 'Top-of-page visibility' },
  { placement: 'Mid-Page Banner', size: '300×250', format: 'Display', rate: '$199/mo', notes: 'In-content placement' },
  { placement: 'Article Sidebar', size: '300×600', format: 'Display', rate: '$149/mo', notes: 'All article pages' },
  { placement: 'Newsletter Slot', size: 'Full-width', format: 'Email', rate: '$249/mo', notes: 'Weekly digest audience' },
  { placement: 'Sponsored Article', size: 'Full page', format: 'Editorial', rate: '$499 flat', notes: 'Labeled sponsored content' },
];

const demographics = [
  { label: 'Gender', value: '78% Male / 22% Female' },
  { label: 'Age Range', value: '35–54 (primary)' },
  { label: 'Owner-Operators', value: '65%' },
  { label: 'Fleet Managers', value: '35%' },
  { label: 'Top States', value: 'TX, FL, CA, OH, GA' },
  { label: 'Device Split', value: '68% Mobile / 32% Desktop' },
];

const categories = [
  { name: 'Compliance & FMCSA', reach: '4,200+ monthly readers', pct: '42%' },
  { name: 'Insurance & Risk', reach: '2,800+ monthly readers', pct: '28%' },
  { name: 'Freight & Rates', reach: '2,100+ monthly readers', pct: '21%' },
  { name: 'Trucks & Equipment', reach: '1,500+ monthly readers', pct: '15%' },
  { name: 'Lifestyle & Business', reach: '900+ monthly readers', pct: '9%' },
];

export default function MediaKitPage() {
  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

        {/* Hero */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest mb-3 font-bold" style={{ color: '#F5C518' }}>
            Media Kit 2025
          </p>
          <h1
            className="text-4xl sm:text-5xl mb-4 uppercase"
            style={{ fontFamily: 'Impact, sans-serif', color: '#F5C518' }}
          >
            Advertise With Truck King Hub
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: '#d1d5db' }}>
            Connect your brand with 10,000+ monthly readers who are actively making decisions about equipment, insurance,
            compliance services, and freight — the commercial trucking professionals that drive America&apos;s supply chain.
          </p>
        </div>

        {/* Audience Snapshot */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16 rounded-lg p-6"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
        >
          {[
            { value: '10,000+', label: 'Monthly Readers' },
            { value: '3.5M', label: 'US Truck Drivers (TAM)' },
            { value: '65%', label: 'Owner-Operators' },
            { value: '#1', label: 'Topic: Compliance' },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-2">
              <div
                className="text-3xl font-black mb-1"
                style={{ color: '#F5C518', fontFamily: 'Impact, sans-serif' }}
              >
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-wide" style={{ color: '#9ca3af' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Who We Reach */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span style={{ background: '#F5C518', width: 4, height: 28, display: 'inline-block', borderRadius: 2 }} />
            <h2
              className="text-2xl font-bold uppercase"
              style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
            >
              Who We Reach
            </h2>
          </div>
          <p className="leading-relaxed mb-4" style={{ color: '#d1d5db' }}>
            Our primary audience is owner-operators and small fleet owners managing between 1 and 25 trucks. These are
            working professionals with purchasing authority — they buy their own insurance, choose their own equipment,
            select their own ELD and dispatch software, and make daily operational decisions without a corporate procurement team.
          </p>
          <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
            Secondary audience includes fleet managers, dispatchers, and trucking service providers who follow our
            compliance and regulatory coverage closely.
          </p>
        </section>

        {/* Ad Placements Table */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span style={{ background: '#F5C518', width: 4, height: 28, display: 'inline-block', borderRadius: 2 }} />
            <h2
              className="text-2xl font-bold uppercase"
              style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
            >
              Ad Placements & Rates
            </h2>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #2a2a2a' }}>
            <div
              className="grid grid-cols-5 gap-0 px-4 py-3 text-xs uppercase tracking-widest font-bold"
              style={{ background: '#111111', color: '#9ca3af', borderBottom: '1px solid #2a2a2a' }}
            >
              <span>Placement</span>
              <span>Size</span>
              <span>Format</span>
              <span>Rate</span>
              <span>Notes</span>
            </div>
            {adPlacements.map((row, i) => (
              <div
                key={row.placement}
                className="grid grid-cols-5 gap-0 px-4 py-4 text-sm items-center"
                style={{
                  background: i % 2 === 0 ? '#1a1a1a' : '#161616',
                  borderBottom: i < adPlacements.length - 1 ? '1px solid #2a2a2a' : 'none',
                }}
              >
                <span className="font-semibold" style={{ color: '#ffffff' }}>{row.placement}</span>
                <span style={{ color: '#d1d5db' }}>{row.size}</span>
                <span style={{ color: '#d1d5db' }}>{row.format}</span>
                <span className="font-bold" style={{ color: '#F5C518' }}>{row.rate}</span>
                <span className="text-xs" style={{ color: '#9ca3af' }}>{row.notes}</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: '#6b7280' }}>
            All rates are net. Minimum run: 30 days. Volume discounts available for 3+ month commitments.
          </p>
        </section>

        {/* Audience Demographics */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span style={{ background: '#F5C518', width: 4, height: 28, display: 'inline-block', borderRadius: 2 }} />
            <h2
              className="text-2xl font-bold uppercase"
              style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
            >
              Audience Demographics
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {demographics.map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center px-5 py-4 rounded-lg"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
              >
                <span className="text-sm uppercase tracking-wide font-semibold" style={{ color: '#9ca3af' }}>
                  {item.label}
                </span>
                <span className="text-sm font-bold" style={{ color: '#ffffff' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Content Categories */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span style={{ background: '#F5C518', width: 4, height: 28, display: 'inline-block', borderRadius: 2 }} />
            <h2
              className="text-2xl font-bold uppercase"
              style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
            >
              Content Categories
            </h2>
          </div>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#d1d5db' }}>
            You can target your campaign to specific content verticals. Below are our top categories with estimated
            monthly reach per section.
          </p>
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between px-5 py-4 rounded-lg"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
              >
                <div>
                  <div className="font-semibold text-sm mb-0.5" style={{ color: '#ffffff' }}>{cat.name}</div>
                  <div className="text-xs" style={{ color: '#9ca3af' }}>{cat.reach}</div>
                </div>
                <div
                  className="text-sm font-black px-3 py-1 rounded"
                  style={{ background: '#0d0d0d', color: '#F5C518', border: '1px solid #F5C518' }}
                >
                  {cat.pct}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Advertise */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span style={{ background: '#F5C518', width: 4, height: 28, display: 'inline-block', borderRadius: 2 }} />
            <h2
              className="text-2xl font-bold uppercase"
              style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
            >
              Why Truck King Hub
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Niche Audience', desc: 'No wasted spend. Every reader is a commercial trucking professional with real purchasing power.' },
              { title: 'High Intent', desc: 'Our readers come to make decisions. Compliance tools, insurance, ELDs, fuel cards — they&apos;re actively researching.' },
              { title: 'Brand Safety', desc: 'We produce original, sourced editorial content. Your brand appears alongside credible trucking news.' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg p-5"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
              >
                <h3 className="font-bold text-sm uppercase tracking-wide mb-2" style={{ color: '#F5C518' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}
                   dangerouslySetInnerHTML={{ __html: item.desc }} />
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div
          className="rounded-lg p-8 text-center"
          style={{ background: '#1a1a1a', border: '1px solid #F5C518' }}
        >
          <h3
            className="text-2xl mb-3 uppercase"
            style={{ fontFamily: 'Impact, sans-serif', color: '#F5C518' }}
          >
            Book Your Campaign
          </h3>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: '#d1d5db' }}>
            Ready to reach owner-operators and fleet decision-makers? Contact our advertising team to discuss placements,
            targeting, and custom packages. We respond within one business day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@truckkinghub.com"
              className="inline-block px-8 py-3 rounded font-black uppercase text-sm tracking-widest"
              style={{ background: '#F5C518', color: '#0d0d0d' }}
            >
              Email: info@truckkinghub.com
            </a>
          </div>
          <p className="text-xs mt-6" style={{ color: '#6b7280' }}>
            Need a PDF media kit? Email us and we&apos;ll send one within 24 hours.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/about" className="text-sm underline" style={{ color: '#9ca3af' }}>
            Learn more about Truck King Hub →
          </Link>
        </div>

      </div>
    </div>
  );
}
