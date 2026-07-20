// --- src/utils/calculations.js ---
import data from './data';

const getCostPerKWpForSize = (countryData, kWp) => {
  const tiers = countryData.costPerKWpTiers;
  if (kWp <= 1) return tiers["1kW"];
  if (kWp <= 2) return tiers["2kW"];
  if (kWp <= 3) return tiers["3kW"];
  if (kWp <= 4) return tiers["4kW"];
  if (kWp <= 5) return tiers["5kW"];
  return tiers["Above 5kW (average)"];
};

const calculations = {
  /**
   * Estimates annual solar production in kWh based on user inputs and country.
   * @param {object} inputs - User form data (country, roofOrientation).
   * @returns {number} Estimated annual production in kWh/kWp.
   */
  getSolarProductionPerKWp: (inputs) => {
    const { country = 'India', roofOrientation } = inputs;
    const countryData = data[country];
    const baseAnnualProduction = countryData.solarYieldPerKWpYear;
    const derate = data.orientationDerates[roofOrientation];

    if (derate) {
      return baseAnnualProduction * derate;
    }
    // Fallback for an unhandled orientation
    return countryData.generalSolarIrradianceIndia || baseAnnualProduction;
  },

  /**
   * Calculates the recommended system size in kWp, constrained by roof area and budget.
   * @param {object} inputs - User form data.
   * @param {number} annualProductionPerKWp - Annual kWh production per kWp.
   * @returns {number} Recommended system size in kWp.
   */
  calculateSystemSize: (inputs, annualProductionPerKWp) => {
    const { country = 'India', annualConsumptionKWh, desiredCoveragePercent, roofArea, investmentBudget } = inputs;
    const countryData = data[country];

    if (!annualConsumptionKWh || annualConsumptionKWh <= 0 || !annualProductionPerKWp || annualProductionPerKWp <= 0) {
      return 0;
    }

    const targetConsumptionKWh = annualConsumptionKWh * (desiredCoveragePercent / 100);
    let requiredKWp = targetConsumptionKWh / annualProductionPerKWp;

    // Consider roof area constraint (India roof area is entered in sqft, Sweden in m^2)
    const roofAreaM2 = countryData.roofAreaUnit === 'sqft' ? (roofArea || 0) * data.m2PerSqft : (roofArea || 0);
    const maxKWpFromRoofArea = roofAreaM2 / countryData.spacePerKWpM2;
    if (requiredKWp > maxKWpFromRoofArea) {
      requiredKWp = maxKWpFromRoofArea;
    }

    // Consider budget constraint
    if (investmentBudget && investmentBudget > 0) {
      const estimatedCostPerKWp = getCostPerKWpForSize(countryData, requiredKWp <= 0 ? 1 : requiredKWp);
      const maxKWpFromBudget = investmentBudget / estimatedCostPerKWp;
      if (requiredKWp > maxKWpFromBudget) {
        requiredKWp = maxKWpFromBudget;
      }
    }

    return Math.max(0, requiredKWp);
  },

  /**
   * Calculates total installation cost and the applicable subsidy/tax deduction.
   * India: PM Surya Ghar upfront subsidy. Sweden: Grön Teknik tax deduction (capped per applicant).
   * @param {object} inputs - User form data (country, numApplicants for Sweden).
   * @param {number} systemSizeKWp - Recommended system size in kWp.
   * @returns {object} { totalCost, subsidyOrDeductionAmount, netCost, subsidyOrDeductionLabel }
   */
  calculateInstallationCost: (inputs, systemSizeKWp) => {
    const { country = 'India', numApplicants = 1 } = inputs;
    const countryData = data[country];

    if (systemSizeKWp <= 0) {
      return { totalCost: 0, subsidyOrDeductionAmount: 0, netCost: 0, subsidyOrDeductionLabel: '' };
    }

    const costPerKWpForSize = getCostPerKWpForSize(countryData, systemSizeKWp);
    const totalCost = costPerKWpForSize * systemSizeKWp;

    let subsidyOrDeductionAmount = 0;
    let subsidyOrDeductionLabel = '';

    if (country === 'India') {
      subsidyOrDeductionLabel = 'Government Subsidy (PM Surya Ghar)';
      const { upTo2kWPerKW, additionalKWBetween2And3, fixedFor3kWAndAbove } = countryData.solarSubsidy;
      if (systemSizeKWp <= 2) {
        subsidyOrDeductionAmount = systemSizeKWp * upTo2kWPerKW;
      } else if (systemSizeKWp <= 3) {
        subsidyOrDeductionAmount = Math.min(
          (2 * upTo2kWPerKW) + ((systemSizeKWp - 2) * additionalKWBetween2And3),
          fixedFor3kWAndAbove
        );
      } else {
        subsidyOrDeductionAmount = fixedFor3kWAndAbove;
      }
    } else {
      subsidyOrDeductionLabel = 'Grön Teknik Tax Deduction';
      const { rate, capPerPerson } = countryData.greenTechDeduction;
      subsidyOrDeductionAmount = Math.min(totalCost * rate, capPerPerson * numApplicants);
    }

    const netCost = totalCost - subsidyOrDeductionAmount;
    return {
      totalCost: Math.round(totalCost),
      subsidyOrDeductionAmount: Math.round(subsidyOrDeductionAmount),
      netCost: Math.round(netCost),
      subsidyOrDeductionLabel
    };
  },

  /**
   * Calculates annual savings from solar.
   * India: self-consumption capped at 90% of annual consumption (net-metering-like).
   * Sweden: splits production into self-consumed (full retail price) and exported
   * (spot-price-only, since the feed-in tax credit was abolished 1 Jan 2026).
   * @param {object} inputs - User form data.
   * @param {number} annualSolarProductionKWh - Total annual kWh produced by the system.
   * @returns {number} Estimated annual savings in local currency.
   */
  calculateAnnualSavings: (inputs, annualSolarProductionKWh) => {
    const { country = 'India', annualConsumptionKWh, avgElectricityPrice, selfConsumptionRate } = inputs;
    if (!annualConsumptionKWh || !avgElectricityPrice || !annualSolarProductionKWh) {
      return 0;
    }
    const countryData = data[country];

    if (country === 'India') {
      const cap = countryData.selfConsumptionCapRate;
      if (annualSolarProductionKWh >= annualConsumptionKWh * cap) {
        return annualConsumptionKWh * cap * avgElectricityPrice;
      }
      return annualSolarProductionKWh * avgElectricityPrice;
    }

    // Sweden
    const consumptionRate = selfConsumptionRate || countryData.defaultSelfConsumptionRate;
    const selfConsumedKWh = Math.min(annualSolarProductionKWh * consumptionRate, annualConsumptionKWh);
    const exportedKWh = Math.max(0, annualSolarProductionKWh - selfConsumedKWh);

    const savingsFromSelfConsumption = selfConsumedKWh * avgElectricityPrice;
    const exportPrice = avgElectricityPrice * countryData.exportPriceRatioOfRetail;
    const incomeFromExport = exportedKWh * exportPrice;

    return savingsFromSelfConsumption + incomeFromExport;
  },

  /**
   * Projects financial outcomes over a period of years.
   * @param {object} inputs - User form data.
   * @param {number} netCost - Initial net cost of the solar system.
   * @param {number} initialAnnualSolarProductionKWh - Solar production in year 1.
   * @param {number} initialAnnualSavings - Annual savings in year 1.
   * @param {number} projectionYears - Number of years to project.
   * @returns {object} { solarProjection, traditionalSavingsProjection, paybackPeriod }
   */
  projectFinancials: (inputs, netCost, initialAnnualSolarProductionKWh, initialAnnualSavings, projectionYears = 25) => {
    const { country = 'India', avgElectricityPrice } = inputs;
    const countryData = data[country];
    const solarDegradationRate = data.solarDegradationRatePerYear;
    const electricityPriceInflationRate = (inputs.electricityPriceInflationRate ?? countryData.electricityPriceInflationRate) / 100;
    const comparisonInterestRate = (inputs.comparisonInvestmentInterestRate ?? countryData.comparisonInvestmentInterestRate) / 100;

    const solarProjection = [];
    const traditionalSavingsProjection = [];

    solarProjection.push({
      year: 0,
      annualProductionKWh: 0,
      annualSavings: 0,
      cumulativeCashFlow: -netCost
    });
    traditionalSavingsProjection.push({
      year: 0,
      balance: netCost
    });

    let cumulativeSolarCashFlow = -netCost;
    let traditionalSavingsBalance = netCost;

    let paybackPeriod = null;

    for (let year = 1; year <= projectionYears; year++) {
      const currentYearProductionKWh = initialAnnualSolarProductionKWh * Math.pow((1 - solarDegradationRate), (year - 1));
      const currentYearAvgElectricityPrice = avgElectricityPrice * Math.pow((1 + electricityPriceInflationRate), (year - 1));

      const currentYearSavings = calculations.calculateAnnualSavings({
        ...inputs,
        avgElectricityPrice: currentYearAvgElectricityPrice
      }, currentYearProductionKWh);

      cumulativeSolarCashFlow += currentYearSavings;

      if (paybackPeriod === null && cumulativeSolarCashFlow >= 0) {
        paybackPeriod = year;
      }

      traditionalSavingsBalance *= (1 + comparisonInterestRate);

      solarProjection.push({
        year: year,
        annualProductionKWh: Math.round(currentYearProductionKWh),
        annualSavings: Math.round(currentYearSavings),
        cumulativeCashFlow: Math.round(cumulativeSolarCashFlow)
      });

      traditionalSavingsProjection.push({
        year: year,
        balance: Math.round(traditionalSavingsBalance)
      });
    }

    return { solarProjection, traditionalSavingsProjection, paybackPeriod };
  }
};

export default calculations;
