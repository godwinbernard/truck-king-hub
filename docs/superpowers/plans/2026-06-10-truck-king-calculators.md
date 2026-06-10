# Truck King Hub Calculators Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive `/calculators` page for Truck King Hub with five practical trucking calculators for fuel cost, cost per mile, profit per load, break-even rate, and trip time.

**Architecture:** Implement the feature as one client-rendered public page with self-contained calculator cards, shared formatting helpers, and a simple hero plus FAQ section. Keep the page aligned with the existing dark editorial design so it feels native to Truck King Hub and works well on mobile and desktop.

**Tech Stack:** Next.js App Router, React client components, TypeScript, Tailwind utility classes, existing public layout and navbar components.

---

### Task 1: Build calculators page

**Files:**
- Create: `src/app/(public)/calculators/page.tsx`

- [ ] **Step 1: Write the page component**

```tsx
export default function CalculatorsPage() {
  return <main>...</main>;
}
```

- [ ] **Step 2: Render five calculator cards**

```tsx
<FuelCostCalculator />
<CostPerMileCalculator />
<ProfitPerLoadCalculator />
<BreakEvenRateCalculator />
<TripTimeCalculator />
```

- [ ] **Step 3: Add live formulas**

```ts
const fuelCost = (miles / mpg) * dieselPrice;
const costPerMile = totalCost / miles;
const profitPerLoad = revenue - totalCost;
const breakEvenRate = operatingCost / billableMiles;
const tripTime = miles / averageSpeed + stopHours + delayBufferHours;
```

- [ ] **Step 4: Verify the page renders at mobile and desktop widths**

Run: `npm run build`
Expected: build completes and `/calculators` is included in the route map.

- [ ] **Step 5: Commit the page**

```bash
git add src/app/(public)/calculators/page.tsx
git commit -m "feat: add truck calculators page"
```

### Task 2: Add navigation entry

**Files:**
- Modify: `src/components/ui/NavBar.tsx`

- [ ] **Step 1: Add the calculators link**

```tsx
const NAV_LINKS = [
  { href: '/calculators', label: 'Calculators' },
  { href: '/', label: 'Home' },
  { href: '/brief', label: 'News' },
];
```

- [ ] **Step 2: Verify the navbar still wraps cleanly on mobile**

Run: `npm run build`
Expected: build completes with no layout or type errors.

- [ ] **Step 3: Commit the nav update**

```bash
git add src/components/ui/NavBar.tsx
git commit -m "feat: add calculators nav link"
```

### Task 3: Final verification

**Files:**
- Test: `src/app/(public)/calculators/page.tsx`

- [ ] **Step 1: Confirm the page handles empty and default values gracefully**

```tsx
// default values keep all results finite and displayable
```

- [ ] **Step 2: Run the production build one last time**

Run: `npm run build`
Expected: complete success.

- [ ] **Step 3: Review the public page visually**

Open `/calculators` and confirm the cards stack on mobile, align in two columns on desktop, and the results remain readable.

