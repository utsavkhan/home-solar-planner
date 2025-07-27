import React, { useState, useEffect, useCallback } from 'react'; // Keep this line
import Card from '../components/Card'; // Add this line
import calculations from '../utils/calculations'; // <--- REMOVE THE CURLY BRACES

const SolarDesignSection = ({ formData, onPrev, onNext }) => {
  // Derived state based on formData
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Perform calculations
    const annualProductionPerKWp = calculations.getSolarProductionPerKWp(formData);
    const recommendedSystemSizeKWp = calculations.calculateSystemSize(formData, annualProductionPerKWp);
    const { totalCostINR, subsidyINR, netCostINR } = calculations.calculateInstallationCost(recommendedSystemSizeKWp);
    const annualSolarProductionKWh = recommendedSystemSizeKWp * annualProductionPerKWp;
    const initialAnnualSavingsINR = calculations.calculateAnnualSavings(formData, annualSolarProductionKWh);

    setResults({
      annualProductionPerKWp,
      recommendedSystemSizeKWp,
      totalCostINR,
      subsidyINR,
      netCostINR,
      annualSolarProductionKWh,
      initialAnnualSavingsINR
    });
    setIsLoading(false);
  }, [formData]); // Recalculate if form data changes

  if (isLoading || !results) {
    return (
      <Card title="Calculating Your Solar Design...">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Please wait while we crunch the numbers...</p>
        </div>
      </Card>
    );
  }

  const {
    annualProductionPerKWp,
    recommendedSystemSizeKWp,
    totalCostINR,
    subsidyINR,
    netCostINR,
    annualSolarProductionKWh,
    initialAnnualSavingsINR
  } = results;

  // Updated to use 570W panel for estimation
  const panelsNeeded = Math.ceil(recommendedSystemSizeKWp * 1000 / 570); // Assuming 570W panels for estimation

  return (
    <Card title="Your Solar Plant Design & Cost">
      <div className="space-y-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 shadow-sm">
          <h3 className="text-xl font-bold text-green-800 mb-4">Recommended System</h3>
          <p className="text-gray-700 text-lg">
            Based on your inputs, we recommend a system of:
            <span className="block text-4xl font-extrabold text-green-700 mt-2">
              {recommendedSystemSizeKWp.toFixed(1)} kWp
            </span>
          </p>
          <p className="text-gray-600 mt-2">
            This system is estimated to generate approximately{" "}
            <span className="font-semibold text-green-700">{annualSolarProductionKWh.toLocaleString('en-IN')} kWh</span> annually.
          </p>
          <p className="text-gray-600 text-sm mt-1">
            (Equivalent to about {panelsNeeded} solar panels, assuming 570W/panel)
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-sm">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Estimated Costing</h3>
          <div className="space-y-2 text-gray-700">
            <p className="flex justify-between items-center text-lg">
              <span>Total Estimated Installation Cost:</span>
              <span className="font-bold text-blue-700">₹ {totalCostINR.toLocaleString('en-IN')}</span>
            </p>
            <p className="flex justify-between items-center text-lg">
              <span>Less: Government Subsidy (PM Surya Ghar):</span>
              <span className="font-bold text-red-600">- ₹ {subsidyINR.toLocaleString('en-IN')}</span>
            </p>
            <hr className="border-blue-300 my-3" />
            <p className="flex justify-between items-center text-xl font-extrabold">
              <span>Your Net Investment:</span>
              <span className="text-green-800">₹ {netCostINR.toLocaleString('en-IN')}</span>
            </p>
          </div>
          <p className="text-gray-600 text-sm mt-4">
            *Subsidy calculation is based on the PM Surya Ghar: Muft Bijli Yojana guidelines.
            Actual subsidy may vary based on official verification.
          </p>
          <p className="text-gray-600 text-sm mt-2 font-semibold text-red-700">
            **Note: This cost excludes one-time Discom (Distribution Company) charges, which are typically between ₹15,000 - ₹20,000 for a solar meter installation.
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 shadow-sm">
          <h3 className="text-xl font-bold text-purple-800 mb-4">Initial Savings Potential</h3>
          <p className="text-gray-700 text-lg">
            In the first year, your estimated electricity bill savings and export income could be up to:
            <span className="block text-4xl font-extrabold text-purple-700 mt-2">
              ₹ {initialAnnualSavingsINR.toLocaleString('en-IN')}
            </span>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            This is based on your average electricity price of ₹{formData.avgElectricityPriceINR.toFixed(2)}/kWh.
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-md"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
        >
          See Detailed Savings →
        </button>
      </div>
    </Card>
  );
};

export default SolarDesignSection;