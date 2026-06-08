import { db } from '@/lib/db/client';
import { directoryListings } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

const CATEGORY_LABELS: Record<string, string> = {
  load_board: 'Load Boards', truck_stop: 'Truck Stops', association: 'Associations',
  compliance_tool: 'Compliance Tools', eld: 'ELDs', fuel_card: 'Fuel Cards',
  factoring: 'Factoring', maintenance: 'Maintenance', insurance: 'Insurance',
  equipment: 'Equipment Marketplaces', training: 'Training & CDL',
};

export default async function ResourcesPage() {
  const listings = await db
    .select()
    .from(directoryListings)
    .orderBy(asc(directoryListings.category), asc(directoryListings.name));

  const grouped = listings.reduce<Record<string, typeof listings>>((acc, item) => {
    acc[item.category] = acc[item.category] ?? [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy mb-2">Owner-Operator Resource Directory</h1>
      <p className="text-slate-500 text-sm mb-2">Curated tools and services for trucking businesses. Editorial only — no sponsored listings, no affiliate links.</p>
      <div className="bg-navy/5 border border-navy/10 rounded-lg px-4 py-3 mb-8">
        <p className="text-sm text-slate-700">Finding the right load board, fuel card, ELD, or factoring company takes time. We&apos;ve done the research so you don&apos;t have to. Every listing is manually reviewed and updated by our team.</p>
      </div>
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-navy border-l-4 border-gold pl-3 mb-4">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-4 border-t-4 border-t-navy">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-navy text-sm">{item.name}</h3>
                  {item.brokenLink && (
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold flex-shrink-0">Link Issue</span>
                  )}
                </div>
                {item.description && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>}
                {item.bestFor && <p className="text-xs text-slate-500 mt-1"><span className="font-semibold">Best for:</span> {item.bestFor}</p>}
                {item.notes && <p className="text-xs text-slate-400 mt-1 italic">{item.notes}</p>}
                <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs font-semibold text-navy underline hover:text-navy-light">
                  Visit website →
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}
      {Object.keys(grouped).length === 0 && (
        <p className="text-slate-400 text-sm">Directory listings coming soon. We&apos;re reviewing and adding resources now.</p>
      )}
    </div>
  );
}
