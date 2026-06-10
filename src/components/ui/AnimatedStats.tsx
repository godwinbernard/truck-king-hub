'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: '3.5M+', label: 'US Truck Drivers', icon: '🚛' },
  { value: '$800B', label: 'Annual Revenue',   icon: '💰' },
  { value: '70%',   label: 'Freight by Truck', icon: '📦' },
  { value: 'Daily', label: 'Intel Updates',    icon: '⚡' },
];

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function StatRing({ value, label, icon, delay }: { value: string; label: string; icon: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} className="flex flex-col items-center gap-3"
      style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.6s ${delay}ms, transform 0.6s ${delay}ms` }}>
      <div className="stat-ring flex-col gap-1">
        <span className="text-xl leading-none" aria-hidden="true">{icon}</span>
        <span className="font-black text-white text-2xl leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>{value}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-center" style={{ color: '#9ca3af' }}>{label}</p>
    </div>
  );
}

export function AnimatedStats() {
  return (
    <section className="map-bg py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
          {STATS.map((s, i) => (
            <StatRing key={s.label} value={s.value} label={s.label} icon={s.icon} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
