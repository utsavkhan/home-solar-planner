// --- src/utils/data.js ---

// Shared unit conversion (not country-specific, this is just physics)
const sqftPerM2 = 10.7639;
const m2PerSqft = 1 / sqftPerM2;

// Typical panel degradation, shared across markets (panel physics, not a market assumption)
const solarDegradationRatePerYear = 0.005; // 0.5% per year

// Orientation derate factors relative to south-facing, shared physics-based assumption
const orientationDerates = {
  South: 1,
  East: 0.75,
  West: 0.75,
  North: 0.60,
  "South-East": 0.95,
  "South-West": 0.95,
  Flat: 0.90,
};

const India = {
  countryLabel: "India",
  currency: "INR",
  currencySymbol: "₹",
  locale: "en-IN",
  roofAreaUnit: "sqft",
  roofAreaUnitLabel: "Square foot",

  // Typical residential panel in the Indian market (2026): 500-600W+ high-format modules
  panelWattage: 570, // W
  panelAreaM2: 2.58, // m^2 per panel (2278mm x 1133mm)
  spacePerKWpM2: (2.58 / 570) * 1000, // ~4.53 m^2 per kWp allowing for spacing/access

  // Solar Irradiance Estimate (kWh/kWp/year) for South-facing, good tilt
  // National average ~1400 kWh/kWp/yr; 4.5 kWh/kWp/day thumb rule used as base (conservative)
  solarYieldPerKWpYear: 4.5 * 365, // 1642.5 kWh/kWp/year
  generalSolarIrradianceIndia: 1400, // fallback for unhandled orientation

  // Average household consumption (kWh/year) - highly generalized
  averageConsumptionByPropertyType: {
    "Apartment (Small)": 1500,
    "Apartment (Medium)": 3000,
    "Independent House (Small)": 5000,
    "Independent House (Medium)": 8000,
    "Independent House (Large)": 12000,
  },

  // Cost per kWp (INR) before subsidy. Reconfirmed 2026: market range ~55,000-85,000/kWp.
  costPerKWpTiers: {
    "1kW": 78000,
    "2kW": 72000,
    "3kW": 70000,
    "4kW": 68000,
    "5kW": 66000,
    "Above 5kW (average)": 64000,
  },

  // PM Surya Ghar: Muft Bijli Yojana Subsidy Structure (reconfirmed 2026, unchanged)
  solarSubsidy: {
    upTo2kWPerKW: 30000, // ₹30,000/kW for first 2 kW
    additionalKWBetween2And3: 18000, // ₹18,000 per kW for capacity between 2kW and 3kW
    fixedFor3kWAndAbove: 78000, // Fixed ₹78,000 for 3 kW system and above (capped)
  },

  generalOptimalTiltAngle: 20, // degrees, reference only

  // Net-metering-like self-consumption cap: production above 90% of annual consumption
  // isn't credited at the full retail rate in this model
  selfConsumptionCapRate: 0.9,

  // One-time Discom (Distribution Company) net-meter installation charge, excluded from
  // the headline install cost
  netMeterChargeRange: { min: 15000, max: 20000 },

  // Fixed Deposit interest rate (reconfirmed 2026: major banks SBI/HDFC/ICICI top out
  // ~6.45-6.50% for general depositors; small finance banks advertise higher but aren't
  // representative of a mainstream comparison)
  comparisonInvestmentLabel: "Fixed Deposit (FD)",
  comparisonInvestmentInterestRate: 6.5,

  // Reconfirmed 2026 national average residential tariff
  avgElectricityPrice: 7.5,

  electricityPriceInflationRate: 6, // %/year default
};

const Sweden = {
  countryLabel: "Sweden",
  currency: "SEK",
  currencySymbol: "kr",
  locale: "sv-SE",
  roofAreaUnit: "m2",
  roofAreaUnitLabel: "m²",

  // Typical residential panel in the Swedish market (2026): 400-460W modules are standard,
  // noticeably lower-wattage than India's high-format panels
  panelWattage: 440, // W
  panelAreaM2: 1.95, // m^2 per panel (~1722mm x 1133mm)
  spacePerKWpM2: (1.95 / 440) * 1000, // ~4.43 m^2 per kWp allowing for spacing/access

  // National average solar yield (kWh/kWp/year), south ~25% better than north of country
  solarYieldPerKWpYear: 950,

  averageConsumptionByPropertyType: {
    "Apartment (Small)": 2000,
    "Apartment (Medium)": 3500,
    "Villa (electric heating)": 15000,
    "Villa (district/other heating)": 6000,
  },

  // Cost per kWp (SEK) before deduction. Smaller systems cost more per kWp.
  costPerKWpTiers: {
    "1kW": 18000,
    "2kW": 16500,
    "3kW": 15000,
    "4kW": 14000,
    "5kW": 13000,
    "Above 5kW (average)": 12000,
  },

  // Grön Teknik green technology tax deduction (reduced from 20% to 15% on 1 Jul 2025)
  greenTechDeduction: {
    rate: 0.15,
    capPerPerson: 50000, // SEK/person/year
  },

  // Since the microproduction tax credit (60 öre/kWh, capped 30,000 kWh/18,000 kr/year)
  // was abolished 1 Jan 2026, exported electricity now only earns the spot price plus a
  // small nätnytta (grid benefit, ~5 öre/kWh) from the electricity retailer - no fixed
  // bonus. Households without a battery typically self-consume only a minority of what
  // they generate.
  defaultSelfConsumptionRate: 0.30,
  // Nordpool spot price averages ~0.325 kr/kWh nationally vs ~2.3 kr/kWh retail - roughly
  // a 0.14 ratio; rounded slightly up to account for the small nätnytta addition.
  exportPriceRatioOfRetail: 0.15,

  comparisonInvestmentLabel: "Savings Account (Sparkonto)",
  comparisonInvestmentInterestRate: 2.5,

  // Reconfirmed 2026 (SCB - Statistics Sweden): national retail average incl. grid
  // fees/tax ~2.3-2.5 kr/kWh; varies sharply by zone (SE1-SE4)
  avgElectricityPrice: 2.3,

  electricityPriceInflationRate: 3, // %/year default, more stable market than India
};

const countryData = {
  orientationDerates,
  sqftPerM2,
  m2PerSqft,
  solarDegradationRatePerYear,
  India,
  Sweden,
};

export default countryData;
