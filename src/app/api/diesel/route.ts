import { NextResponse } from 'next/server';

const REGIONS: Record<string, string> = {
  NUS: 'National Avg',
  R10: 'East Coast',
  R20: 'Midwest',
  R30: 'Gulf Coast',
  R40: 'Rocky Mountain',
  R50: 'West Coast',
};

export interface DieselRegion {
  region: string;
  code: string;
  price: number;
  prevPrice: number;
  change: number;
  history: number[];
}

export interface DieselData {
  updatedAt: string;
  weekOf: string;
  regions: DieselRegion[];
  source: string;
}

// Fallback prices (Jun 2025 actuals from EIA) used if API is unavailable
const FALLBACK: DieselData = {
  updatedAt: new Date().toISOString(),
  weekOf: 'Jun 9, 2025',
  source: 'fallback',
  regions: [
    { code: 'NUS', region: 'National Avg',   price: 3.623, prevPrice: 3.662, change: -0.039, history: [3.623, 3.662, 3.701, 3.688] },
    { code: 'R10', region: 'East Coast',     price: 3.598, prevPrice: 3.637, change: -0.039, history: [3.598, 3.637, 3.672, 3.658] },
    { code: 'R20', region: 'Midwest',        price: 3.541, prevPrice: 3.581, change: -0.040, history: [3.541, 3.581, 3.619, 3.604] },
    { code: 'R30', region: 'Gulf Coast',     price: 3.450, prevPrice: 3.491, change: -0.041, history: [3.450, 3.491, 3.529, 3.515] },
    { code: 'R40', region: 'Rocky Mountain', price: 3.612, prevPrice: 3.648, change: -0.036, history: [3.612, 3.648, 3.684, 3.670] },
    { code: 'R50', region: 'West Coast',     price: 4.312, prevPrice: 4.358, change: -0.046, history: [4.312, 4.358, 4.401, 4.385] },
  ],
};

function buildRegions(rows: { period: string; duoarea: string; value: string }[]): DieselData {
  const byArea: Record<string, number[]> = {};
  for (const row of rows) {
    const code = row.duoarea;
    if (!REGIONS[code]) continue;
    if (!byArea[code]) byArea[code] = [];
    byArea[code].push(parseFloat(row.value));
  }

  const latestPeriod = rows[0]?.period ?? '';
  const weekOf = latestPeriod
    ? new Date(latestPeriod + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  const regions: DieselRegion[] = Object.entries(REGIONS).map(([code, region]) => {
    const hist = byArea[code] ?? [];
    const price = hist[0] ?? 0;
    const prevPrice = hist[1] ?? price;
    return {
      code,
      region,
      price,
      prevPrice,
      change: parseFloat((price - prevPrice).toFixed(3)),
      history: hist.slice(0, 4),
    };
  });

  return { updatedAt: new Date().toISOString(), weekOf, regions, source: 'eia' };
}

async function fetchV2WithKey(apiKey: string): Promise<DieselData> {
  const url =
    `https://api.eia.gov/v2/petroleum/pri/gnd/data/` +
    `?api_key=${apiKey}` +
    `&frequency=weekly` +
    `&data[0]=value` +
    `&facets[product][]=DPF` +
    `&facets[duoarea][]=${Object.keys(REGIONS).join('&facets[duoarea][]=')}` +
    `&sort[0][column]=period` +
    `&sort[0][direction]=desc` +
    `&length=24`;

  const res = await fetch(url, { next: { revalidate: 21600 } });
  if (!res.ok) throw new Error(`EIA v2 error: ${res.status}`);
  const json = await res.json();
  const rows = json?.response?.data ?? [];
  if (!rows.length) throw new Error('Empty EIA v2 response');
  return buildRegions(rows);
}

async function fetchV1NoKey(): Promise<DieselData> {
  // EIA v1 open series — weekly on-highway diesel, national + PAD districts
  const seriesIds = ['PET.EMD_EPD2D_PTE_NUS_DPG.W', 'PET.EMD_EPD2D_PTE_R10_DPG.W', 'PET.EMD_EPD2D_PTE_R20_DPG.W', 'PET.EMD_EPD2D_PTE_R30_DPG.W', 'PET.EMD_EPD2D_PTE_R40_DPG.W', 'PET.EMD_EPD2D_PTE_R50_DPG.W'];
  const codeMap: Record<string, string> = {
    'PET.EMD_EPD2D_PTE_NUS_DPG.W': 'NUS',
    'PET.EMD_EPD2D_PTE_R10_DPG.W': 'R10',
    'PET.EMD_EPD2D_PTE_R20_DPG.W': 'R20',
    'PET.EMD_EPD2D_PTE_R30_DPG.W': 'R30',
    'PET.EMD_EPD2D_PTE_R40_DPG.W': 'R40',
    'PET.EMD_EPD2D_PTE_R50_DPG.W': 'R50',
  };

  const url = `https://api.eia.gov/v1/series/?series_id=${seriesIds.join(';')}&num=8&out=json`;
  const res = await fetch(url, { next: { revalidate: 21600 } });
  if (!res.ok) throw new Error(`EIA v1 error: ${res.status}`);
  const json = await res.json();
  const series: Array<{ series_id: string; data: [string, number][] }> = json?.series ?? [];
  if (!series.length) throw new Error('Empty EIA v1 response');

  const byArea: Record<string, number[]> = {};
  let latestDate = '';
  for (const s of series) {
    const code = codeMap[s.series_id];
    if (!code) continue;
    byArea[code] = s.data.map(([, v]) => v);
    if (!latestDate && s.data[0]?.[0]) latestDate = s.data[0][0];
  }

  const weekOf = latestDate
    ? new Date(latestDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  const regions: DieselRegion[] = Object.entries(REGIONS).map(([code, region]) => {
    const hist = byArea[code] ?? [];
    const price = hist[0] ?? 0;
    const prevPrice = hist[1] ?? price;
    return { code, region, price, prevPrice, change: parseFloat((price - prevPrice).toFixed(3)), history: hist.slice(0, 4) };
  });

  return { updatedAt: new Date().toISOString(), weekOf, regions, source: 'eia' };
}

export async function GET() {
  const apiKey = process.env.EIA_API_KEY;

  try {
    const data = apiKey ? await fetchV2WithKey(apiKey) : await fetchV1NoKey();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 's-maxage=21600, stale-while-revalidate=3600' },
    });
  } catch {
    try {
      const data = await fetchV1NoKey();
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 's-maxage=21600, stale-while-revalidate=3600' },
      });
    } catch {
      return NextResponse.json(FALLBACK, {
        headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=600' },
      });
    }
  }
}
