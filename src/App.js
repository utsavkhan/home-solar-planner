import React, { useState } from 'react';
import Header from './components/Header';
import CountrySelector from './components/CountrySelector';
import InputSection from './sections/InputSection';
import SolarDesignSection from './sections/SolarDesignSection';
import SavingsComparisonSection from './sections/SavingsComparisonSection';
import Footer from './components/Footer';
import data from './utils/data';

const buildDefaultFormData = (country) => {
  const countryData = data[country];
  return {
    country,
    annualConsumptionKWh: 5000,
    avgElectricityPrice: countryData.avgElectricityPrice,
    roofArea: '',
    roofOrientation: "South",
    desiredCoveragePercent: 100,
    investmentBudget: '', // Optional, leave empty
    electricityPriceInflationRate: countryData.electricityPriceInflationRate,
    comparisonInvestmentInterestRate: countryData.comparisonInvestmentInterestRate,
    projectionYears: 25,
    numApplicants: 1,
  };
};

const App = () => {
  const [country, setCountry] = useState('');
  const [formData, setFormData] = useState(null);
  // State to control the current step of the calculator
  const [step, setStep] = useState(0); // 0: Country, 1: Input, 2: Design, 3: Savings

  const handleFormChange = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleCountryNext = () => {
    setFormData(buildDefaultFormData(country));
    nextStep();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <Header countryLabel={country ? data[country].countryLabel : null} />
      <main className="flex-grow container mx-auto p-4 md:p-8 max-w-4xl">
        {step === 0 && (
          <CountrySelector
            country={country}
            onSelectCountry={setCountry}
            onNext={handleCountryNext}
          />
        )}
        {step === 1 && formData && (
          <InputSection
            formData={formData}
            onFormChange={handleFormChange}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
        {step === 2 && formData && (
          <SolarDesignSection
            formData={formData}
            onPrev={prevStep}
            onNext={nextStep}
          />
        )}
        {step === 3 && formData && (
          <SavingsComparisonSection
            formData={formData}
            onPrev={prevStep}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
