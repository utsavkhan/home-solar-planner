// --- src/utils/calculations.js ---
import data from './data'; // <--- CHANGED: Import the default export as 'data'

const calculations = {
  /**
   * Estimates annual solar production in kWh based on user inputs.
   * @param {object} inputs - User form data.
   * @returns {number} Estimated annual production in kWh/kWp.
   */
  getSolarProductionPerKWp: (inputs) => {
    const { roofOrientation } = inputs;

    // Base production for South-facing, 5 kWh/kWp/day * 365 days
    const southFacingAnnualProduction = 5 * 365; // 1825 kWh/kWp/year

    let annualProductionKWhPerKWp;

    if (roofOrientation === "South") {
      annualProductionKWhPerKWp = southFacingAnnualProduction;
    } else if (roofOrientation === "East" || roofOrientation === "West") {
      // 25% reduction from South
      annualProductionKWhPerKWp = southFacingAnnualProduction * (1 - 0.25);
    } else if (roofOrientation === "North") {
      // 40% reduction from South
      annualProductionKWhPerKWp = southFacingAnnualProduction * (1 - 0.40);
    } else if (roofOrientation === "South-East" || roofOrientation === "South-West") {
      // Keeping previous 5% reduction from South
      annualProductionKWhPerKWp = southFacingAnnualProduction * 0.95;
    } else if (roofOrientation === "Flat") {
      // Keeping previous 10% reduction from South for flat with tilt structure
      annualProductionKWhPerKWp = southFacingAnnualProduction * 0.90;
    } else {
      // Fallback to general average if somehow an unhandled orientation is selected
      annualProductionKWhPerKWp = data.generalSolarIrradianceIndia; // <--- CHANGED: Access via data.
    }

    // Shading and tilt angle are no longer inputs and are assumed to be optimized
    // or their effects are implicitly covered by these general reduction factors.
    return annualProductionKWhPerKWp;
  },

  /**
   * Calculates the recommended system size in kWp.
   * @param {object} inputs - User form data.
   * @param {number} annualProductionPerKWp - Annual kWh production per kWp.
   * @returns {number} Recommended system size in kWp.
   */
  calculateSystemSize: (inputs, annualProductionPerKWp) => {
    const { annualConsumptionKWh, desiredCoveragePercent, roofAreaM2, investmentBudgetINR } = inputs;

    if (!annualConsumptionKWh || annualConsumptionKWh <= 0 || !annualProductionPerKWp || annualProductionPerKWp <= 0) {
      return 0;
    }

    const targetConsumptionKWh = annualConsumptionKWh * (desiredCoveragePercent / 100);
    let requiredKWp = targetConsumptionKWh / annualProductionPerKWp;

    // Consider roof area constraint (assuming 570W panel takes ~2.58 m² = 4.53 m² per kWp)
    const spacePerKWp = 4.53; // m^2 per kWp for a 570W panel (2278mm x 1133mm)
    const maxKWpFromRoofArea = roofAreaM2 / spacePerKWp;
    if (requiredKWp > maxKWpFromRoofArea) {
      requiredKWp = maxKWpFromRoofArea; // Limit by available roof space
    }

    // Consider budget constraint
    if (investmentBudgetINR && investmentBudgetINR > 0) {
      let estimatedCostPerKWp = data.solarCostPerKWp["Above 5kW (average)"]; // <--- CHANGED: Access via data.
      if (requiredKWp <= 1) estimatedCostPerKWp = data.solarCostPerKWp["1kW"]; // <--- CHANGED: Access via data.
      else if (requiredKWp <= 2) estimatedCostPerKWp = data.solarCostPerKWp["2kW"]; // <--- CHANGED: Access via data.
      else if (requiredKWp <= 3) estimatedCostPerKWp = data.solarCostPerKWp["3kW"]; // <--- CHANGED: Access via data.
      else if (requiredKWp <= 4) estimatedCostPerKWp = data.solarCostPerKWp["4kW"]; // <--- CHANGED: Access via data.
      else if (requiredKWp <= 5) estimatedCostPerKWp = data.solarCostPerKWp["5kW"]; // <--- CHANGED: Access via data.

      const maxKWpFromBudget = investmentBudgetINR / estimatedCostPerKWp;
      if (requiredKWp > maxKWpFromBudget) {
        requiredKWp = maxKWpFromBudget; // Limit by budget
      }
    }


    return requiredKWp;
  },

  /**
   * Calculates the total installation cost and applicable subsidy.
   * @param {number} systemSizeKWp - Recommended system size in kWp.
   * @returns {object} { totalCostINR, subsidyINR, netCostINR }
   */
  calculateInstallationCost: (systemSizeKWp) => {
    let totalCostINR = 0;
    let subsidyINR = 0;

    if (systemSizeKWp <= 0) {
      return { totalCostINR: 0, subsidyINR: 0, netCostINR: 0 };
    }

    // Determine cost per kWp based on system size and scale accordingly
    let costPerKWpForSize;
    if (systemSizeKWp <= 1) {
      costPerKWpForSize = data.solarCostPerKWp["1kW"]; // <--- CHANGED: Access via data.
    } else if (systemSizeKWp <= 2) {
      costPerKWpForSize = data.solarCostPerKWp["2kW"]; // <--- CHANGED: Access via data.
    } else if (systemSizeKWp <= 3.3) { // Use 3.3kW specific cost
      costPerKWpForSize = data.solarCostPerKWp["3kW"]; // <--- CHANGED: Access via data.
    } else if (systemSizeKWp <= 4.6) { // Use 4.6kW specific cost
      costPerKWpForSize = data.solarCostPerKWp["4kW"]; // <--- CHANGED: Access via data.
    } else if (systemSizeKWp <= 5) {
      costPerKWpForSize = data.solarCostPerKWp["5kW"]; // <--- CHANGED: Access via data.
    } else {
      costPerKWpForSize = data.solarCostPerKWp["Above 5kW (average)"]; // <--- CHANGED: Access via data.
    }
    totalCostINR = costPerKWpForSize * systemSizeKWp;


    // Calculate subsidy based on PM Surya Ghar scheme
    if (systemSizeKWp > 0) {
      if (systemSizeKWp <= 2) {
        subsidyINR = systemSizeKWp * data.solarSubsidyIndia.upTo2kWPerKW; // <--- CHANGED: Access via data.
      } else if (systemSizeKWp > 2 && systemSizeKWp <= 3) {
        // For capacity between 2kW and 3kW
        subsidyINR = (2 * data.solarSubsidyIndia.upTo2kWPerKW) + ((systemSizeKWp - 2) * data.solarSubsidyIndia.additionalKWBetween2And3); // <--- CHANGED: Access via data.
        // Ensure it does not exceed the 3kW cap
        subsidyINR = Math.min(subsidyINR, data.solarSubsidyIndia.fixedFor3kWAndAbove); // <--- CHANGED: Access via data.
      } else {
        // For systems 3kW and above, fixed subsidy
        subsidyINR = data.solarSubsidyIndia.fixedFor3kWAndAbove; // <--- CHANGED: Access via data.
      }
    }

    const netCostINR = totalCostINR - subsidyINR;
    return { totalCostINR: Math.round(totalCostINR), subsidyINR: Math.round(subsidyINR), netCostINR: Math.round(netCostINR) };
  },

  /**
   * Calculates annual savings from solar.
   * @param {object} inputs - User form data.
   * @param {number} annualSolarProductionKWh - Total annual kWh produced by the system.
   * @returns {number} Estimated annual savings in INR.
   */
  calculateAnnualSavings: (inputs, annualSolarProductionKWh) => {
    const { annualConsumptionKWh, avgElectricityPriceINR } = inputs;
    if (!annualConsumptionKWh || !avgElectricityPriceINR || !annualSolarProductionKWh) {
      return 0;
    }

    /* // Assume a certain percentage of self-consumption (e.g., 70%) and export (30%)
    // This can be made an input or more dynamic later.
    const selfConsumptionRate = 0.70; // % of generated power consumed directly
    const exportRate = 1 - selfConsumptionRate; // % of generated power exported

    const selfConsumedKWh = Math.min(annualSolarProductionKWh * selfConsumptionRate, annualConsumptionKWh);
    const exportedKWh = annualSolarProductionKWh - selfConsumedKWh; // Actual exported after self-consumption

    // Savings from self-consumption (avoided bill)
    const savingsFromSelfConsumption = selfConsumedKWh * avgElectricityPriceINR;

    // Income from exported electricity (assuming a lower feed-in tariff, e.g., 50% of purchase price)
    const feedInTariffINR = avgElectricityPriceINR * 0.5; // Example: 50% of average price
    const incomeFromExport = exportedKWh * feedInTariffINR;

    // Remaining electricity needed from grid
    const remainingConsumptionKWh = Math.max(0, annualConsumptionKWh - selfConsumedKWh);
    const remainingBill = remainingConsumptionKWh * avgElectricityPriceINR;

    // Total annual savings = (Avoided Bill + Export Income) - Remaining Bill (if any)
    // For simplicity, let's calculate direct savings from avoided purchase + export income
    const totalAnnualSavings = savingsFromSelfConsumption + incomeFromExport; 

    // Simplified Calculation assumed only 90% of electricity bill is offset
    const totalAnnualSavings = annualConsumptionKWh * 0.9 * avgElectricityPriceINR;*/
    let totalAnnualSavings;

    if (annualSolarProductionKWh >= annualConsumptionKWh * 0.9)
      totalAnnualSavings = annualConsumptionKWh * 0.9 * avgElectricityPriceINR;
    else
      totalAnnualSavings = annualSolarProductionKWh * avgElectricityPriceINR;

    return totalAnnualSavings;
  },

  /**
   * Projects financial outcomes over a period of years.
   * @param {object} inputs - User form data.
   * @param {number} netCostINR - Initial net cost of the solar system.
   * @param {number} initialAnnualSolarProductionKWh - Solar production in year 1.
   * @param {number} initialAnnualSavingsINR - Annual savings in year 1.
   * @param {number} projectionYears - Number of years to project.
   * @returns {object} { solarProjection, traditionalSavingsProjection, paybackPeriod }
   */
  projectFinancials: (inputs, netCostINR, initialAnnualSolarProductionKWh, initialAnnualSavingsINR, projectionYears = 25) => {
    const { avgElectricityPriceINR } = inputs;
    const solarDegradationRate = 0.005; // 0.5% per year
    const electricityPriceInflationRate = (inputs.electricityPriceInflationRate || 6) / 100; // Default 6% per year
    const initialTraditionalSavingsInterestRate = (inputs.traditionalSavingsInterestRate || data.avgFDInterestRates.general) / 100; // <--- CHANGED: Access via data.

    const solarProjection = [];
    const traditionalSavingsProjection = [];

    // Add Year 0 data
    solarProjection.push({
      year: 0,
      annualProductionKWh: 0,
      annualSavingsINR: 0,
      cumulativeCashFlowINR: -netCostINR
    });
    traditionalSavingsProjection.push({
      year: 0,
      balanceINR: netCostINR
    });

    let cumulativeSolarCashFlow = -netCostINR;
    let traditionalSavingsBalance = netCostINR; // Initial investment into savings

    let paybackPeriod = null;

    for (let year = 1; year <= projectionYears; year++) {
      // Solar Calculations
      const currentYearProductionKWh = initialAnnualSolarProductionKWh * Math.pow((1 - solarDegradationRate), (year - 1));
      const currentYearAvgElectricityPrice = avgElectricityPriceINR * Math.pow((1 + electricityPriceInflationRate), (year - 1));

      // Recalculate annual savings for the current year with degraded production and inflated price
      const currentYearSavings = calculations.calculateAnnualSavings({
        ...inputs,
        avgElectricityPriceINR: currentYearAvgElectricityPrice // Use inflated price
      }, currentYearProductionKWh);

      cumulativeSolarCashFlow += currentYearSavings;

      if (paybackPeriod === null && cumulativeSolarCashFlow >= 0) {
        paybackPeriod = year;
      }

      // Traditional Savings Calculations: Interest rate remains same 
      const currentYearTraditionalInterestRate = initialTraditionalSavingsInterestRate;
      traditionalSavingsBalance *= (1 + currentYearTraditionalInterestRate);


      solarProjection.push({
        year: year,
        annualProductionKWh: Math.round(currentYearProductionKWh),
        annualSavingsINR: Math.round(currentYearSavings),
        cumulativeCashFlowINR: Math.round(cumulativeSolarCashFlow)
      });

      traditionalSavingsProjection.push({
        year: year,
        balanceINR: Math.round(traditionalSavingsBalance)
      });
    }

    return { solarProjection, traditionalSavingsProjection, paybackPeriod };
  }
};

export default calculations;