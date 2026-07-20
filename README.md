# Home Solar Planner

A React single-page wizard that helps homeowners in **India** and **Sweden** size and price a rooftop on-grid solar system, and compares long-term solar savings against a traditional interest-bearing investment.

## What it does

1. **Country** — pick India or Sweden; this drives currency, units, and every constant used below.
2. **Home details** — annual electricity consumption, electricity price, usable roof area, roof orientation, desired coverage %, optional budget cap.
3. **Solar design** — recommended system size (kWp), panel count, total installation cost, and the applicable government incentive.
4. **Savings comparison** — a year-by-year projection (chart + table) of cumulative solar cash flow vs. the same money left in a comparison investment, plus estimated payback period.

## Quick start

Requirements: [Node.js](https://nodejs.org/) 18+ and npm (bundled with Node).

```bash
git clone https://github.com/utsavkhan/home-solar-planner.git
cd home-solar-planner
npm install
npm start
```

This starts the development server at [http://localhost:3000](http://localhost:3000) with hot-reload — the app opens automatically in your default browser.

### Other scripts

| Command | What it does |
|---|---|
| `npm start` | Runs the app in development mode with hot-reload. |
| `npm run build` | Builds an optimized production bundle into `build/`. |
| `npm test` | Launches the test runner in interactive watch mode. |

### Trying a production build locally

```bash
npm run build
npx serve -s build
```

Serves the optimized build (same one CI would produce) at `http://localhost:3000` (or the next free port).

## Project structure

```text
src/
  components/     Reusable UI pieces (Card, Dropdown, FormInput, SliderInput, Header, Footer, CountrySelector)
  sections/        The 3 wizard steps (InputSection, SolarDesignSection, SavingsComparisonSection)
  utils/
    data.js        Per-country constants: currency, units, panel specs, costs, subsidies, interest rates
    calculations.js Core sizing/cost/savings/payback formulas, parameterized by country
    format.js       Currency and chart-tick formatting helpers
  App.js           Wizard state machine (country → inputs → design → savings)
```

To add a new country, add an entry to `src/utils/data.js` following the shape of the existing `India`/`Sweden` blocks, then branch any country-specific *logic* (not just constants) in `src/utils/calculations.js` — see the Sweden branches there (Grön Teknik deduction, spot-price export income) as an example of where a country needs more than new numbers.

## Country-specific assumptions (reconfirmed for 2026)

| | India | Sweden |
|---|---|---|
| Currency / roof unit | ₹ / sqft | kr / m² |
| Typical residential panel | 570W, ~2.58 m² (500-600W+ high-format modules are standard) | 440W, ~1.95 m² (400-460W modules are standard, noticeably lower-wattage than India's) |
| Residential electricity price (default) | ~₹7.5/kWh (national avg ~₹7.2, ranges ₹3-12 by state) | ~2.3 kr/kWh (SCB national retail avg incl. grid fees/tax; varies sharply by elområde SE1-SE4) |
| Solar yield, south-facing | ~1,640 kWh/kWp/yr (4.5 kWh/kWp/day) | ~950 kWh/kWp/yr (range 800-1,100, ~25% lower in the north) |
| Install cost per kWp | ~₹64,000-78,000 (cheaper per kWp at larger sizes) | ~16,500-20,000 kr (cheaper per kWp at larger sizes; cross-checked against Tibber, Vattenfall, and 1Komma5, skewed to the higher end of each range) |
| Incentive | PM Surya Ghar: Muft Bijli Yojana — upfront subsidy, ₹30,000/kW to 2kW, ₹18,000 for the 3rd kW, capped at ₹78,000 for 3kW+ | Grön Teknik — 15% tax deduction on invoice cost (reduced from 20% on 1 Jul 2025), capped at 50,000 kr per person per year |
| Export/self-consumption model | Net-metering-like; self-consumption capped at 90% of annual consumption | No feed-in tax credit since it was abolished 1 Jan 2026 — exported power only earns roughly spot price (~15% of retail, reflecting Nordpool spot ~0.325 kr/kWh vs ~2.3 kr/kWh retail); only a minority of production is typically self-consumed without a battery (default assumption 30%) |
| Comparison investment | Fixed Deposit, ~6.5% (major bank rates, e.g. SBI/HDFC/ICICI) | Savings account (sparkonto), ~2.5% |

These are point-in-time market estimates (installer quotes, subsidy rates, and electricity prices vary by region and change over time) and should be periodically reconfirmed — see `src/utils/data.js` for the exact constants and `src/utils/calculations.js` for how they're applied.

## Disclaimer

This tool produces rough, illustrative estimates for personal planning only — it is not financial, tax, or engineering advice. Always get quotes from licensed installers and confirm current subsidy/tax rules with the relevant authority (PM Surya Ghar / MNRE for India, Skatteverket for Sweden) before making investment decisions.

## Contributing

Issues and PRs are welcome. If you're updating a cost/subsidy/tariff constant in `src/utils/data.js`, please cite the source in your PR description (and update the table above) so the numbers stay traceable.

## License

[MIT](LICENSE)
