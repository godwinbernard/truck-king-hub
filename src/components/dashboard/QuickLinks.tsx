const LINKS = [
  { label: 'FMCSA', href: 'https://www.fmcsa.dot.gov' },
  { label: 'SAFER', href: 'https://safer.fmcsa.dot.gov' },
  { label: 'Federal Register', href: 'https://www.federalregister.gov' },
  { label: 'DAT Load Board', href: 'https://www.dat.com' },
  { label: 'Truckstop', href: 'https://truckstop.com' },
  { label: 'OOIDA', href: 'https://www.ooida.com' },
  { label: 'Pilot Flying J', href: 'https://pilotflyingj.com' },
  { label: "Love's Travel Stops", href: 'https://www.loves.com' },
];

export function QuickLinks() {
  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Quick Links</h2>
      <div className="flex flex-wrap gap-2">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-navy text-white text-xs font-medium px-3 py-1.5 rounded hover:bg-navy-light transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
