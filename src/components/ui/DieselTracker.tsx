'use client';

import { useEffect, useState } from 'react';
import type { DieselData, DieselRegion } from '@/app/api/diesel/route';

function Sparkline({ history }: { history: number[] }) {
  // history is newest-first; reverse for left→right timeline
  const vals = [...history].reverse();
  if (vals.length < 2) return null;

  const min = Math.min(...vals) - 0.05;
  const max = Math.max(...vals) + 0.05;
  const range = max - min || 0.01;
  const w = 56;
  const h = 24;
  const step = w / (vals.length - 1);

  const points = vals
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke="#F5C518"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* dot on latest (rightmost) */}
      <circle
        cx={(vals.length - 1) * step}
        cy={h - ((vals[vals.length - 1] - min) / range) * h}
        r="2.5"
        fill="#F5C518"
      />
    </svg>
  );
}

function TrendBadge({ change }: { change: number }) {
  if (change === 0) return <span style={{ color: '#9ca3af' }} className="text-xs font-bold">→ Flat</span>;
  const up = change > 0;
  return (
    <span className="text-xs font-bold" style={{ color: up ? '#ef4444' : '#22c55e' }}>
      {up ? '↑' : '↓'} ${Math.abs(change).toFixed(3)}
    </span>
  );
}

function RegionRow({ r }: { r: DieselRegion }) {
  const isNational = r.code === 'NUS';
  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3"
      style={{
        background: isNational ? '#1a1500' : '#111111',
        borderBottom: '1px solid #1f1f1f',
        borderLeft: isNational ? '3px solid #F5C518' : '3px solid transparent',
      }}
    >
      <div className="min-w-0">
        <p className={`text-sm font-bold leading-none mb-0.5 ${isNational ? 'text-white' : ''}`}
          style={{ color: isNational ? '#fff' : '#d1d5db' }}>
          {r.region}
          {isNational && (
            <span className="ml-2 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 align-middle"
              style={{ background: '#F5C518', color: '#0d0d0d' }}>
              Nat&apos;l
            </span>
          )}
        </p>
        <TrendBadge change={r.change} />
      </div>

      <div className="shrink-0 hidden sm:block">
        <Sparkline history={r.history} />
      </div>

      <div className="shrink-0 text-right">
        <p className={`text-lg font-black leading-none`}
          style={{ color: isNational ? '#F5C518' : '#ffffff', fontFamily: 'Impact, sans-serif' }}>
          ${r.price.toFixed(3)}
        </p>
        <p className="text-[10px]" style={{ color: '#555' }}>per gal</p>
      </div>
    </div>
  );
}

export function DieselTracker() {
  const [data, setData] = useState<DieselData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/diesel')
      .then((r) => r.json())
      .then((d: DieselData) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const national = data?.regions.find((r) => r.code === 'NUS');
  const regions = data?.regions.filter((r) => r.code !== 'NUS') ?? [];

  return (
    <section
      style={{ background: '#0d0d0d', borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a' }}
      aria-label="Diesel price tracker"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
              <span>⛽</span> Weekly Diesel Price Tracker
            </p>
            <h2 className="text-2xl font-black uppercase text-white" style={{ fontFamily: 'Impact, sans-serif' }}>
              {loading
                ? 'Loading prices…'
                : national
                  ? <>National Avg: <span style={{ color: '#F5C518' }}>${national.price.toFixed(3)}</span>/gal</>
                  : 'Diesel Prices By Region'}
            </h2>
          </div>
          <div className="text-right">
            {data && (
              <>
                <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>
                  Week of {data.weekOf}
                </p>
                <p className="text-[10px]" style={{ color: '#444' }}>
                  Source: U.S. Energy Information Administration
                  {data.source === 'fallback' && ' (cached)'}
                </p>
              </>
            )}
            <a
              href="https://www.eia.gov/petroleum/gasdiesel/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold uppercase tracking-widest hover:underline"
              style={{ color: '#F5C518' }}
            >
              Full data at EIA.gov ↗
            </a>
          </div>
        </div>

        {loading ? (
          /* Skeleton */
          <div className="space-y-px" style={{ border: '1px solid #2a2a2a' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse" style={{ background: '#1a1a1a' }} />
            ))}
          </div>
        ) : !data ? (
          <div className="py-8 text-center text-sm" style={{ color: '#9ca3af' }}>
            Price data temporarily unavailable. Check{' '}
            <a href="https://www.eia.gov/petroleum/gasdiesel/" target="_blank" rel="noopener noreferrer"
              className="underline" style={{ color: '#F5C518' }}>EIA.gov</a> directly.
          </div>
        ) : (
          <div style={{ border: '1px solid #2a2a2a', overflow: 'hidden' }}>
            {/* National first */}
            {national && <RegionRow r={national} />}
            {/* Then regions in 2-col grid on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {regions.map((r) => (
                <RegionRow key={r.code} r={r} />
              ))}
            </div>
          </div>
        )}

        {/* Context strip */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs" style={{ color: '#555' }}>
          <span>DPF = No. 2 Diesel, all grades</span>
          <span>Prices are retail on-highway averages</span>
          <span>Updated weekly (Monday release)</span>
          <span>
            <a href="/calculators" className="hover:underline" style={{ color: '#9ca3af' }}>
              → Calculate your fuel cost
            </a>
          </span>
        </div>

      </div>
    </section>
  );
}
