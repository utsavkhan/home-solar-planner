import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import calculations from '../utils/calculations';
import countryData from '../utils/data';
import { formatCurrency, formatChartTick } from '../utils/format';

const SavingsComparisonSection = ({ formData, onPrev }) => {
  const [projectionData, setProjectionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const country = formData.country;
  const currentCountryData = countryData[country];
  const locale = currentCountryData.locale;

  useEffect(() => {
    setIsLoading(true);
    const annualProductionPerKWp = calculations.getSolarProductionPerKWp(formData);
    const recommendedSystemSizeKWp = calculations.calculateSystemSize(formData, annualProductionPerKWp);
    const { netCost } = calculations.calculateInstallationCost(formData, recommendedSystemSizeKWp);
    const annualSolarProductionKWh = recommendedSystemSizeKWp * annualProductionPerKWp;
    const initialAnnualSavings = calculations.calculateAnnualSavings(formData, annualSolarProductionKWh);

    const { solarProjection, traditionalSavingsProjection, paybackPeriod } = calculations.projectFinancials(
      formData,
      netCost,
      annualSolarProductionKWh,
      initialAnnualSavings,
      formData.projectionYears || 25
    );

    setProjectionData({ solarProjection, traditionalSavingsProjection, paybackPeriod, netCost });
    setIsLoading(false);
  }, [formData]);

  if (isLoading || !projectionData) {
    return (
      <Card title="Generating Savings Projections...">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Building your financial forecast...</p>
        </div>
      </Card>
    );
  }

  const { solarProjection, traditionalSavingsProjection, paybackPeriod } = projectionData;
  const projectionYears = formData.projectionYears || 25;
  const comparisonLabel = currentCountryData.comparisonInvestmentLabel;
  const comparisonRate = formData.comparisonInvestmentInterestRate ?? currentCountryData.comparisonInvestmentInterestRate;

  return (
    <Card title="Solar Savings vs. Traditional Investment">
      <div className="space-y-8">
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 shadow-sm text-center">
          <h3 className="text-xl font-bold text-yellow-800 mb-3">Payback Period</h3>
          <p className="text-gray-700 text-lg">
            Your estimated solar payback period is:
            <span className="block text-5xl font-extrabold text-yellow-700 mt-2">
              {paybackPeriod ? `${paybackPeriod} Years` : 'N/A (No Payback within projection period)'}
            </span>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            This is when your cumulative solar savings are expected to cover your initial net investment.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Projected Financial Growth</h3>
          <p className="text-gray-700 mb-4">
            Below is a comparison of your cumulative financial position over {projectionYears} years,
            comparing investing in solar vs. putting your initial net investment into a {comparisonLabel.toLowerCase()}
            (at {comparisonRate}% annual interest).
          </p>

          <div className="h-80 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={solarProjection.map((s, index) => ({
                  year: s.year,
                  'Solar Cumulative Savings': s.cumulativeCashFlow,
                  [`${comparisonLabel} Balance`]: traditionalSavingsProjection[index].balance
                }))}
                margin={{
                  top: 5, right: 10, left: 0, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: 0 }} />
                <YAxis tickFormatter={(value) => formatChartTick(value, country)} width={60} />
                <Tooltip formatter={(value) => formatCurrency(value, country)} />
                <Legend />
                <Line type="monotone" dataKey="Solar Cumulative Savings" stroke="#10B981" activeDot={{ r: 8 }} strokeWidth={2} />
                <Line type="monotone" dataKey={`${comparisonLabel} Balance`} stroke="#6366F1" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b">Year</th>
                  <th className="py-3 px-4 text-right text-gray-700 font-semibold border-b">Solar Cumulative Savings ({currentCountryData.currencySymbol})</th>
                  <th className="py-3 px-4 text-right text-gray-700 font-semibold border-b">{comparisonLabel} Balance ({currentCountryData.currencySymbol})</th>
                </tr>
              </thead>
              <tbody>
                {solarProjection.map((solarData, index) => (
                  <tr key={solarData.year} className={solarData.year % 5 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-4 border-b border-gray-200">{solarData.year}</td>
                    <td className="py-2 px-4 text-right border-b border-gray-200 font-medium">
                      {solarData.cumulativeCashFlow.toLocaleString(locale)}
                    </td>
                    <td className="py-2 px-4 text-right border-b border-gray-200 font-medium">
                      {traditionalSavingsProjection[index].balance.toLocaleString(locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 text-xs italic mt-4">
            *Solar cumulative savings start from your net investment (negative) and increase as you save on bills and earn from export.
            {comparisonLabel} balance starts with your net investment amount and grows with interest.
          </p>
        </div>

        <div className="mt-8 flex">
          <button
            type="button"
            onClick={onPrev}
            className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-md"
          >
            ← Back to Design
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SavingsComparisonSection;
