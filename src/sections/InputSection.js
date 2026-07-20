import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import Dropdown from '../components/Dropdown';
import SliderInput from '../components/SliderInput';
import countryData from '../utils/data';

const InputSection = ({ formData, onFormChange, onNext, onPrev }) => {
  const [localFormData, setLocalFormData] = useState(formData);
  const country = formData.country;
  const isIndia = country === 'India';
  const currentCountryData = countryData[country];

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleNumberChange = (name, value) => {
    const parsedValue = parseFloat(value);
    setLocalFormData(prev => ({
      ...prev,
      [name]: isNaN(parsedValue) ? '' : parsedValue
    }));
    onFormChange({ [name]: isNaN(parsedValue) ? '' : parsedValue });
  };

  const handleSelectChange = (name, value) => {
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    onFormChange({ [name]: value });
  };

  const isFormValid = () => {
    const { annualConsumptionKWh, avgElectricityPrice, roofArea, roofOrientation } = localFormData;

    if (!annualConsumptionKWh || annualConsumptionKWh <= 0 ||
      !avgElectricityPrice || avgElectricityPrice <= 0 ||
      !roofArea || roofArea <= 0 || !roofOrientation) {
      return false;
    }
    return true;
  };

  return (
    <Card title="Tell Us About Your Home">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Current Electricity Usage */}
        <div className="md:col-span-2 border-b pb-4 mb-4 border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Your Current Electricity Usage</h3>
          <FormInput
            label="Average Annual Electricity Consumption"
            type="number"
            name="annualConsumptionKWh"
            unit="kWh/year"
            placeholder={isIndia ? "e.g., 8000" : "e.g., 15000"}
            value={localFormData.annualConsumptionKWh || ''}
            onChange={(e) => handleNumberChange('annualConsumptionKWh', e.target.value)}
            helperText={isIndia
              ? "You can find this on your annual electricity statement. A typical Indian home consumes around 5000-8000 kWh/year."
              : "You can find this in your elräkning (electricity bill) or via your nätägare's portal. A Swedish villa with electric heating often consumes 12,000-20,000 kWh/year; an apartment or district-heated home much less."}
            min="0"
          />
          <FormInput
            label="Average Electricity Price"
            type="number"
            name="avgElectricityPrice"
            unit={`${currentCountryData.currencySymbol}/kWh`}
            placeholder={isIndia ? "e.g., 7.50" : "e.g., 2.30"}
            value={localFormData.avgElectricityPrice || ''}
            onChange={(e) => handleNumberChange('avgElectricityPrice', e.target.value)}
            helperText={isIndia
              ? "This should include all charges (fixed, energy, taxes). Check your latest bill."
              : "This should include grid fees, energy tax, and VAT. Prices vary noticeably by elområde (SE1-SE4), with southern Sweden (SE3/SE4) generally higher than the north (SE1/SE2)."}
            min="0"
            step="0.01"
          />
        </div>

        {/* Section 2: Roof Characteristics */}
        <div className="md:col-span-2 border-b pb-4 mb-4 border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Your Roof's Solar Potential</h3>
          <FormInput
            label="Approximate Usable Roof Area"
            type="number"
            name="roofArea"
            unit={currentCountryData.roofAreaUnitLabel}
            placeholder={isIndia ? "e.g., 500" : "e.g., 45"}
            value={localFormData.roofArea || ''}
            onChange={(e) => handleNumberChange('roofArea', e.target.value)}
            helperText={isIndia
              ? `Estimate the unshaded area where panels can be installed. Each ${currentCountryData.panelWattage}W panel is approx. ${Math.round(currentCountryData.panelAreaM2 * countryData.sqftPerM2)} ${currentCountryData.roofAreaUnitLabel}.`
              : `Estimate the unshaded area where panels can be installed. Each ${currentCountryData.panelWattage}W panel is approx. ${currentCountryData.panelAreaM2} ${currentCountryData.roofAreaUnitLabel}.`}
            min="0"
          />
          <Dropdown
            label="Solar Panel Tilt Direction"
            name="roofOrientation"
            options={[
              { label: "South", value: "South" },
              { label: "South-East", value: "South-East" },
              { label: "South-West", value: "South-West" },
              { label: "East", value: "East" },
              { label: "West", value: "West" },
              { label: "North", value: "North" },
              { label: "Flat", value: "Flat" }
            ]}
            value={localFormData.roofOrientation || ''}
            onChange={(value) => handleSelectChange('roofOrientation', value)}
            helperText={isIndia
              ? "South-facing panels are generally ideal for maximum generation in India."
              : "South-facing panels at a steep tilt (~40-50°) are generally ideal for maximum generation in Sweden."}
          />
        </div>

        {/* Section 3: Desired Coverage & Budget */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Your Solar Goals</h3>
          <SliderInput
            label="Desired Percentage of Electricity Covered by Solar"
            name="desiredCoveragePercent"
            min={0}
            max={100}
            step={10}
            value={localFormData.desiredCoveragePercent || 100}
            onChange={(e) => handleNumberChange('desiredCoveragePercent', e.target.value)}
            unit="%"
            helperText="Do you want to offset all your consumption or just a part?"
          />
          <FormInput
            label="Optional: Your Maximum Budget (Without considering subsidy/deduction)"
            type="number"
            name="investmentBudget"
            unit={currentCountryData.currencySymbol}
            placeholder={isIndia ? "e.g., 300000" : "e.g., 150000"}
            value={localFormData.investmentBudget || ''}
            onChange={(e) => handleNumberChange('investmentBudget', e.target.value)}
            helperText="Leave blank if you want us to recommend the optimal system size."
            min="0"
          />
          {!isIndia && (
            <FormInput
              label="Number of People Claiming the Grön Teknik Deduction"
              type="number"
              name="numApplicants"
              unit="people"
              placeholder="e.g., 1"
              value={localFormData.numApplicants || 1}
              onChange={(e) => handleNumberChange('numApplicants', e.target.value)}
              helperText="The deduction is capped per person (e.g. 2 for a couple who both own the property), each with their own cap."
              min="1"
              max="2"
              step="1"
            />
          )}
          <FormInput
            label="Expected Annual Electricity Price Inflation"
            type="number"
            name="electricityPriceInflationRate"
            unit="%"
            placeholder={isIndia ? "e.g., 6" : "e.g., 3"}
            value={localFormData.electricityPriceInflationRate ?? currentCountryData.electricityPriceInflationRate}
            onChange={(e) => handleNumberChange('electricityPriceInflationRate', e.target.value)}
            helperText="This rate will be used to project the increase in electricity prices annually."
            min="0"
            step="0.1"
          />
          <FormInput
            label={`Annual Interest Rate for ${currentCountryData.comparisonInvestmentLabel}`}
            type="number"
            name="comparisonInvestmentInterestRate"
            unit="%"
            placeholder={`e.g., ${currentCountryData.comparisonInvestmentInterestRate}`}
            value={localFormData.comparisonInvestmentInterestRate ?? currentCountryData.comparisonInvestmentInterestRate}
            onChange={(e) => handleNumberChange('comparisonInvestmentInterestRate', e.target.value)}
            helperText={`This rate is used to compare against putting the same investment into a ${currentCountryData.comparisonInvestmentLabel.toLowerCase()} instead.`}
            min="0"
            step="0.1"
          />
          <FormInput
            label="Projection Years"
            type="number"
            name="projectionYears"
            unit="years"
            placeholder="e.g., 25"
            value={localFormData.projectionYears || 25}
            onChange={(e) => handleNumberChange('projectionYears', e.target.value)}
            helperText="How many years do you want to project your savings? Solar systems are a long term investment and ideally designed to last around 25-30 Years"
            min="5"
            max="30"
            step="1"
          />
          <div className="mt-6 flex justify-between md:col-span-2">
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
              disabled={!isFormValid()}
              className={`py-3 px-8 rounded-full text-white font-semibold text-lg transition-all duration-300 ${isFormValid() ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
              Calculate My Solar Potential →
            </button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default InputSection;
