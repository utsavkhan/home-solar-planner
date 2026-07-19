# Home Solar Planner

A React single-page wizard that helps homeowners in **India** and **Sweden** size and price a rooftop on-grid solar system, and compares long-term solar savings against a traditional interest-bearing investment.

## What it does

1. **Country** — pick India or Sweden; this drives currency, units, and every constant used below.
2. **Home details** — annual electricity consumption, electricity price, usable roof area, roof orientation, desired coverage %, optional budget cap.
3. **Solar design** — recommended system size (kWp), panel count, total installation cost, and the applicable government incentive.
4. **Savings comparison** — a year-by-year projection (chart + table) of cumulative solar cash flow vs. the same money left in a comparison investment, plus estimated payback period.

## Country-specific assumptions (reconfirmed for 2026)

| | India | Sweden |
|---|---|---|
| Currency / roof unit | ₹ / sqft | kr / m² |
| Residential electricity price (default) | ~₹7.5/kWh (national avg ~₹7.2, ranges ₹3-12 by state) | ~2.0 kr/kWh (varies by elområde SE1-SE4; south generally pricier) |
| Solar yield, south-facing | ~1,640 kWh/kWp/yr (4.5 kWh/kWp/day) | ~950 kWh/kWp/yr (range 800-1,100, ~25% lower in the north) |
| Install cost per kWp | ~₹64,000-78,000 (cheaper per kWp at larger sizes) | ~12,000-18,000 kr (cheaper per kWp at larger sizes) |
| Incentive | PM Surya Ghar: Muft Bijli Yojana — upfront subsidy, ₹30,000/kW to 2kW, ₹18,000 for the 3rd kW, capped at ₹78,000 for 3kW+ | Grön Teknik — 15% tax deduction on invoice cost (reduced from 20% on 1 Jul 2025), capped at 50,000 kr per person per year |
| Export/self-consumption model | Net-metering-like; self-consumption capped at 90% of annual consumption | No feed-in tax credit since it was abolished 1 Jan 2026 — exported power only earns roughly spot price (~50% of retail); only a minority of production is typically self-consumed without a battery (default assumption 30%) |
| Comparison investment | Fixed Deposit, ~7.0% | Savings account (sparkonto), ~2.5% |

These are point-in-time market estimates (installer quotes, subsidy rates, and electricity prices vary by region and change over time) and should be periodically reconfirmed — see `src/utils/data.js` for the exact constants and `src/utils/calculations.js` for how they're applied.

## Getting Started (Create React App)

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.
