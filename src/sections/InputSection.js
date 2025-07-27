import React, { useState, useEffect } from 'react';
import Card from '../components/Card'; // <-- Make sure this is here!
import FormInput from '../components/FormInput';
import Dropdown from '../components/Dropdown';
import SliderInput from '../components/SliderInput';


// ... rest of your InputSection component code
const InputSection = ({ formData, onFormChange, onNext }) => {
  // Local state for form inputs, then merge with formData on change
  const [localFormData, setLocalFormData] = useState(formData);

  useEffect(() => {
    // Update local state if formData from parent changes (e.e., on back button)
    setLocalFormData(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setLocalFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    // Immediately pass change to parent state
    onFormChange({ [name]: newValue });
  };

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

  // Validation check for enabling the next button
  const isFormValid = () => {
    const { annualConsumptionKWh, avgElectricityPriceINR, roofAreaM2, roofOrientation } = localFormData;

    // Basic validation: all required fields must have a value
    if (!annualConsumptionKWh || annualConsumptionKWh <= 0 ||
      !avgElectricityPriceINR || avgElectricityPriceINR <= 0 ||
      !roofAreaM2 || roofAreaM2 <= 0 || !roofOrientation) {
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
            placeholder="e.g., 8000"
            value={localFormData.annualConsumptionKWh || ''}
            onChange={(e) => handleNumberChange('annualConsumptionKWh', e.target.value)}
            helperText={`You can find this on your annual electricity statement. A typical Indian home consumes around 5000-8000 kWh/year.`}
            min="0"
          />
          <FormInput
            label="Average Electricity Price"
            type="number"
            name="avgElectricityPriceINR"
            unit="INR/kWh"
            placeholder="e.g., 7.50"
            value={localFormData.avgElectricityPriceINR || ''}
            onChange={(e) => handleNumberChange('avgElectricityPriceINR', e.target.value)}
            helperText="This should include all charges (fixed, energy, taxes). Check your latest bill."
            min="0"
            step="0.01"
          />
        </div>

        {/* Section 2: Roof Characteristics */}
        <div className="md:col-span-2 border-b pb-4 mb-4 border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Your Roof's Solar Potential</h3>
          {/* Removed Roof Type dropdown */}
          <FormInput
            label="Approximate Usable Roof Area"
            type="number"
            name="roofAreaM2"
            unit="m²"
            placeholder="e.g., 50"
            value={localFormData.roofAreaM2 || ''}
            onChange={(e) => handleNumberChange('roofAreaM2', e.target.value)}
            helperText="Estimate the unshaded area where panels can be installed. Each 570W panel is approx. 2.58 m²."
            min="0"
          />
          <Dropdown
            label="Main Roof Orientation (Direction)"
            name="roofOrientation"
            options={[
              { label: "South", value: "South" },
              { label: "South-East", value: "South-East" },
              { label: "South-West", value: "South-West" },
              { label: "East", value: "East" },
              { label: "West", value: "West" },
              { label: "North", value: "North" },
              { label: "Flat Roof (Requires tilt structure)", value: "Flat" },
            ]}
            value={localFormData.roofOrientation || ''}
            onChange={(value) => handleSelectChange('roofOrientation', value)}
            helperText="South-facing roofs are generally ideal for maximum generation in India."
          />
          {/* Removed Roof Tilt Angle input and Shading questions */}
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
            label="Optional: Your Maximum Investment Budget"
            type="number"
            name="investmentBudgetINR"
            unit="₹"
            placeholder="e.g., 300000"
            value={localFormData.investmentBudgetINR || ''}
            onChange={(e) => handleNumberChange('investmentBudgetINR', e.target.value)}
            helperText="Leave blank if you want us to recommend the optimal system size."
            min="0"
          />
          <FormInput
            label="Expected Annual Electricity Price Inflation"
            type="number"
            name="electricityPriceInflationRate"
            unit="%"
            placeholder="e.g., 6"
            value={localFormData.electricityPriceInflationRate || 6}
            onChange={(e) => handleNumberChange('electricityPriceInflationRate', e.target.value)}
            helperText="This rate will be used to project the increase in electricity prices annually. (e.g., 6 for 6%)"
            min="0"
            step="0.1"
          />
          <FormInput
            label="Annual Interest Rate for Traditional Savings"
            type="number"
            name="traditionalSavingsInterestRate"
            unit="%"
            placeholder={`e.g., 6`}
            value={localFormData.traditionalSavingsInterestRate || 6}
            onChange={(e) => handleNumberChange('traditionalSavingsInterestRate', e.target.value)}
            helperText={`This nominal rate will remain constant for every 5-year tenure (like an FD).`}
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
            helperText="How many years do you want to project your savings?"
            min="5"
            max="30"
            step="1"
          />
          <div className="mt-6 flex justify-end">
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