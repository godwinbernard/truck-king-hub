'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
};

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return '0.0%';
  return `${value.toFixed(1)}%`;
}

function formatHours(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0h 0m';
  const totalMinutes = Math.round(value * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function NumberField({ label, value, onChange, step = 1, min = 0, suffix }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(event) => onChange(toNumber(event.target.value))}
          className="w-full rounded-lg border px-3 py-2.5 text-sm text-white outline-none transition-colors focus:ring-2"
          style={{ background: '#111111', borderColor: '#2a2a2a', boxShadow: 'none' }}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: '#6b7280' }}>
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function CalculatorCard({
  eyebrow,
  title,
  description,
  children,
  result,
  hint,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  result: ReactNode;
  hint: string;
}) {
  return (
    <section className="card-shimmer rounded-2xl p-5 sm:p-6" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#F5C518' }}>
        {eyebrow}
      </p>
      <h2 className="text-xl font-black uppercase text-white" style={{ fontFamily: 'Impact, sans-serif' }}>
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
        {description}
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">{children}</div>
        <aside className="rounded-2xl p-4" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
          <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#9ca3af' }}>
            Result
          </p>
          <div className="mt-3">{result}</div>
          <p className="mt-4 text-xs leading-relaxed" style={{ color: '#6b7280' }}>
            {hint}
          </p>
        </aside>
      </div>
    </section>
  );
}

export default function CalculatorsPage() {
  const [fuelMiles, setFuelMiles] = useState(1200);
  const [fuelMpg, setFuelMpg] = useState(7.2);
  const [dieselPrice, setDieselPrice] = useState(3.85);

  const [cpmMiles, setCpmMiles] = useState(1200);
  const [cpmTotalCost, setCpmTotalCost] = useState(3725);

  const [revenue, setRevenue] = useState(4800);
  const [profitFuelCost, setProfitFuelCost] = useState(645);
  const [profitTolls, setProfitTolls] = useState(85);
  const [profitMaintenance, setProfitMaintenance] = useState(180);
  const [profitDriverPay, setProfitDriverPay] = useState(900);
  const [profitOther, setProfitOther] = useState(125);

  const [breakEvenMiles, setBreakEvenMiles] = useState(1200);
  const [breakEvenOperatingCost, setBreakEvenOperatingCost] = useState(3900);

  const [tripMiles, setTripMiles] = useState(680);
  const [tripSpeed, setTripSpeed] = useState(58);
  const [tripStops, setTripStops] = useState(1.5);
  const [tripBuffer, setTripBuffer] = useState(0.75);

  const fuelGallons = fuelMpg > 0 ? fuelMiles / fuelMpg : 0;
  const fuelCost = fuelGallons * dieselPrice;

  const costPerMile = cpmMiles > 0 ? cpmTotalCost / cpmMiles : 0;

  const totalTripCost = profitFuelCost + profitTolls + profitMaintenance + profitDriverPay + profitOther;
  const profit = revenue - totalTripCost;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

  const breakEvenRate = breakEvenMiles > 0 ? breakEvenOperatingCost / breakEvenMiles : 0;

  const driveHours = tripSpeed > 0 ? tripMiles / tripSpeed : 0;
  const totalTripHours = driveHours + tripStops + tripBuffer;

  const quickFacts = useMemo(() => [
    { label: 'Fuel cost', value: formatMoney(fuelCost) },
    { label: 'Cost / mile', value: formatMoney(costPerMile) },
    { label: 'Profit / load', value: formatMoney(profit) },
    { label: 'Break-even', value: formatMoney(breakEvenRate) },
    { label: 'Trip time', value: formatHours(totalTripHours) },
  ], [fuelCost, costPerMile, profit, breakEvenRate, totalTripHours]);

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #2a2a2a', background: '#111111' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1" style={{ color: '#F5C518' }}>
            ⚡ Truck King Hub
          </p>
          <h1 className="text-4xl font-black uppercase text-white" style={{ fontFamily: 'Impact, sans-serif' }}>
            Trucking Calculators
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
            Practical tools for owner-operators and fleet managers to estimate fuel cost, rate pressure, profit, and trip timing before the wheels roll.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {['Fuel Cost', 'Cost Per Mile', 'Profit Per Load', 'Break-Even Rate', 'Trip Time'].map((item) => (
              <span
                key={item}
                className="rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em]"
                style={{ borderColor: 'rgba(245,197,24,0.35)', color: '#F5C518', background: 'rgba(245,197,24,0.08)' }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 mb-8">
          {quickFacts.map((item) => (
            <div key={item.label} className="rounded-2xl p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#9ca3af' }}>
                {item.label}
              </p>
              <p className="mt-2 text-xl font-black text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <CalculatorCard
              eyebrow="Trip Planning"
              title="Fuel Cost Calculator"
              description="Estimate fuel spend for a single load or route using trip miles, fuel economy, and diesel price."
              result={
                <div>
                  <p className="text-3xl font-black text-white">{formatMoney(fuelCost)}</p>
                  <p className="mt-1 text-sm" style={{ color: '#9ca3af' }}>
                    {fuelGallons.toFixed(1)} gallons at {fuelMpg.toFixed(1)} MPG
                  </p>
                </div>
              }
              hint="Use this before quoting a load or comparing lanes. Fuel is one of the easiest trip costs to miss."
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <NumberField label="Trip miles" value={fuelMiles} onChange={setFuelMiles} step={1} />
                <NumberField label="MPG" value={fuelMpg} onChange={setFuelMpg} step={0.1} />
                <NumberField label="Diesel price" value={dieselPrice} onChange={setDieselPrice} step={0.01} suffix="/gal" />
              </div>
            </CalculatorCard>

            <CalculatorCard
              eyebrow="Operating Math"
              title="Cost Per Mile Calculator"
              description="Find your all-in cost per mile so you can compare loads and understand whether a lane is worth hauling."
              result={
                <div>
                  <p className="text-3xl font-black text-white">{formatMoney(costPerMile)}</p>
                  <p className="mt-1 text-sm" style={{ color: '#9ca3af' }}>
                    {(costPerMile * 100).toFixed(1)}¢ per mile
                  </p>
                </div>
              }
              hint="This is most useful when you roll up fuel, tolls, repairs, insurance allocation, and driver pay into one number."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField label="Total trip cost" value={cpmTotalCost} onChange={setCpmTotalCost} step={1} suffix="$" />
                <NumberField label="Billable miles" value={cpmMiles} onChange={setCpmMiles} step={1} />
              </div>
            </CalculatorCard>

            <CalculatorCard
              eyebrow="Load Profit"
              title="Profit Per Load Calculator"
              description="Measure what you actually keep after trip expenses instead of focusing only on gross revenue."
              result={
                <div>
                  <p className={`text-3xl font-black ${profit >= 0 ? 'text-white' : 'text-red-300'}`}>{formatMoney(profit)}</p>
                  <p className="mt-1 text-sm" style={{ color: '#9ca3af' }}>
                    Margin: {formatPercent(profitMargin)}
                  </p>
                </div>
              }
              hint="Useful for owner-operators comparing loads and fleets reviewing margin by lane, customer, or driver."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField label="Load revenue" value={revenue} onChange={setRevenue} step={1} suffix="$" />
                <NumberField label="Fuel cost" value={profitFuelCost} onChange={setProfitFuelCost} step={1} suffix="$" />
                <NumberField label="Tolls" value={profitTolls} onChange={setProfitTolls} step={1} suffix="$" />
                <NumberField label="Maintenance reserve" value={profitMaintenance} onChange={setProfitMaintenance} step={1} suffix="$" />
                <NumberField label="Driver pay" value={profitDriverPay} onChange={setProfitDriverPay} step={1} suffix="$" />
                <NumberField label="Other costs" value={profitOther} onChange={setProfitOther} step={1} suffix="$" />
              </div>
            </CalculatorCard>

            <CalculatorCard
              eyebrow="Rate Planning"
              title="Break-Even Rate Calculator"
              description="Calculate the minimum rate per mile you need to cover operating costs before you make a profit."
              result={
                <div>
                  <p className="text-3xl font-black text-white">{formatMoney(breakEvenRate)}</p>
                  <p className="mt-1 text-sm" style={{ color: '#9ca3af' }}>
                    Minimum required rate per mile
                  </p>
                </div>
              }
              hint="If your quoted rate falls below this number, the load is not covering your baseline operating costs."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField label="Operating cost" value={breakEvenOperatingCost} onChange={setBreakEvenOperatingCost} step={1} suffix="$" />
                <NumberField label="Billable miles" value={breakEvenMiles} onChange={setBreakEvenMiles} step={1} />
              </div>
            </CalculatorCard>

            <CalculatorCard
              eyebrow="Dispatch Timing"
              title="Trip Time Calculator"
              description="Estimate how long a run will take after accounting for driving time, planned stops, and a buffer for delays."
              result={
                <div>
                  <p className="text-3xl font-black text-white">{formatHours(totalTripHours)}</p>
                  <p className="mt-1 text-sm" style={{ color: '#9ca3af' }}>
                    Drive time: {formatHours(driveHours)}
                  </p>
                </div>
              }
              hint="Good for planning appointment windows, dispatch schedules, and realistic delivery promises."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField label="Trip miles" value={tripMiles} onChange={setTripMiles} step={1} />
                <NumberField label="Average speed" value={tripSpeed} onChange={setTripSpeed} step={1} suffix="mph" />
                <NumberField label="Planned stops" value={tripStops} onChange={setTripStops} step={0.25} suffix="hrs" />
                <NumberField label="Delay buffer" value={tripBuffer} onChange={setTripBuffer} step={0.25} suffix="hrs" />
              </div>
            </CalculatorCard>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#F5C518' }}>
                Best for
              </p>
              <h2 className="mt-2 text-xl font-black uppercase text-white" style={{ fontFamily: 'Impact, sans-serif' }}>
                Owner-Operators and Fleet Managers
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                <li>• Quote loads faster with fuel and break-even numbers.</li>
                <li>• Compare lanes using an apples-to-apples cost-per-mile view.</li>
                <li>• Check whether a load is profitable before you accept it.</li>
                <li>• Estimate trip duration before dispatch and appointment booking.</li>
              </ul>
            </div>

            <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#9ca3af' }}>
                Formula summary
              </p>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="font-bold text-white">Fuel Cost</p>
                  <p style={{ color: '#9ca3af' }}>(Miles ÷ MPG) × Diesel price</p>
                </div>
                <div>
                  <p className="font-bold text-white">Cost Per Mile</p>
                  <p style={{ color: '#9ca3af' }}>Total trip cost ÷ billable miles</p>
                </div>
                <div>
                  <p className="font-bold text-white">Profit Per Load</p>
                  <p style={{ color: '#9ca3af' }}>Load revenue - total trip cost</p>
                </div>
                <div>
                  <p className="font-bold text-white">Break-Even Rate</p>
                  <p style={{ color: '#9ca3af' }}>Operating cost ÷ billable miles</p>
                </div>
                <div>
                  <p className="font-bold text-white">Trip Time</p>
                  <p style={{ color: '#9ca3af' }}>Miles ÷ average speed + stops + delay buffer</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(245,197,24,0.06)', border: '1px solid rgba(245,197,24,0.25)' }}>
              <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#F5C518' }}>
                Related content
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
                Use these calculators alongside freight, insurance, and compliance articles to make better decisions before you book a load.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/brief?category=freight" className="text-xs font-black uppercase tracking-widest hover:opacity-80" style={{ color: '#F5C518' }}>
                  Freight Articles →
                </Link>
                <Link href="/brief?category=insurance" className="text-xs font-black uppercase tracking-widest hover:opacity-80" style={{ color: '#F5C518' }}>
                  Insurance Articles →
                </Link>
                <Link href="/brief?category=compliance" className="text-xs font-black uppercase tracking-widest hover:opacity-80" style={{ color: '#F5C518' }}>
                  Compliance Articles →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
