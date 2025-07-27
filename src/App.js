import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './sections/InputSection';
import SolarDesignSection from './sections/SolarDesignSection';
import SavingsComparisonSection from './sections/SavingsComparisonSection';
import Footer from './components/Footer';
import { calculations } from './utils/calculations';
// ... any other imports you might have for calculations or data
import { calculateSolarDesign, calculateSavingsComparison } from './utils/calculations';
import { defaultSystemConfig, defaultUtilityRates, defaultLocationData } from './utils/data';



const App = () => {
  // State to hold all form data across steps
  const [formData, setFormData] = useState(() => {
    // Initialize with default values
    const defaultAnnualConsumption = 5000; // kWh/year, a common average for Indian homes
    const defaultAvgElectricityPrice = 8; // INR/kWh, a common average
    // Removed roofType default
    const defaultRoofArea = 50; // m^2
    const defaultRoofOrientation = "South";
    // Removed hasShading and shadingPercentage defaults
    const defaultDesiredCoverage = 100; // %
    const defaultElectricityPriceInflation = 6; // % - Changed to 6%
    const defaultTraditionalSavingsInterest = 6.5; // % - Changed to 6%
    const defaultProjectionYears = 25; // years

    return {
      annualConsumptionKWh: defaultAnnualConsumption,
      avgElectricityPriceINR: defaultAvgElectricityPrice,
      // roofType is removed
      roofAreaM2: defaultRoofArea,
      roofOrientation: defaultRoofOrientation,
      // roofTiltDegrees is removed, so no default needed here
      // hasShading and shadingPercentage are removed
      desiredCoveragePercent: defaultDesiredCoverage,
      investmentBudgetINR: '', // Optional, leave empty
      electricityPriceInflationRate: defaultElectricityPriceInflation,
      traditionalSavingsInterestRate: defaultTraditionalSavingsInterest,
      projectionYears: defaultProjectionYears,
    };
  });
  // State to control the current step of the calculator
  const [step, setStep] = useState(1); // 1: Input, 2: Design, 3: Savings

  // Callback to update form data from child components
  const handleFormChange = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  // Navigation functions
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 max-w-4xl">
        {step === 1 && (
          <InputSection
            formData={formData}
            onFormChange={handleFormChange}
            onNext={nextStep}
          />
        )}
        {step === 2 && (
          <SolarDesignSection
            formData={formData}
            onPrev={prevStep}
            onNext={nextStep}
          />
        )}
        {step === 3 && (
          <SavingsComparisonSection
            formData={formData}
            onPrev={prevStep}
          />
        )}
        {/* Potentially add a SummarySection for final recap */}
      </main>
      <Footer />
    </div>
  );
};

export default App;