// --- src/utils/data.js ---

// Rough Solar Irradiance Estimates (kWh/kWp/year) for South-facing, good tilt
const generalSolarIrradianceIndia = 1400; // kWh/kWp/year - kept as a fallback, though direct values are now used

// Average household consumption (kWh/year) - highly generalized
const averageConsumptionByPropertyType = {
  "Apartment (Small)": 1500,
  "Apartment (Medium)": 3000,
  "Independent House (Small)": 5000,
  "Independent House (Medium)": 8000,
  "Independent House (Large)": 12000,
};

// Cost per kWp (INR) - before subsidy. These are rough averages.
// Small systems are more expensive per kWp.
const solarCostPerKWp = {
  "1kW": 75000,
  "2kW": 70000,
  "3kW": 72727, // Based on user's 3.3kW example (240000 / 3.3)
  "4kW": 73913, // Based on user's 4.6kW example (340000 / 4.6)
  "5kW": 73000, // Adjusted to be consistent with new scale
  "Above 5kW (average)": 72000, // Adjusted average for larger systems
};

// PM Surya Ghar: Muft Bijli Yojana Subsidy Structure (as of mid-2024/2025 based on search results)
const solarSubsidyIndia = {
  upTo2kWPerKW: 30000, // Up to ₹30,000/kW for first 2 kW
  additionalKWBetween2And3: 18000, // ₹18,000 per kW for capacity between 2kW and 3kW
  fixedFor3kWAndAbove: 78000,   // Fixed ₹78,000 for 3 kW system and above (capped)
};

// Optimal tilt angles for different latitudes in India (rough estimates)
const generalOptimalTiltAngle = 20; // degrees - kept for reference, but not directly used in production calc now

// Average Fixed Deposit Interest Rates in India (for comparison)
const avgFDInterestRates = {
  general: 6.0, // % - Changed to 6%
  seniorCitizen: 7.0, // %
};

// Export all data as a single default object
export default {
  generalSolarIrradianceIndia,
  averageConsumptionByPropertyType,
  solarCostPerKWp,
  solarSubsidyIndia,
  generalOptimalTiltAngle,
  avgFDInterestRates
};
