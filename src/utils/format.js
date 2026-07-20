// --- src/utils/format.js ---
import data from './data';

export const formatCurrency = (value, country = 'India') => {
  const countryData = data[country];
  const formatted = Math.round(value).toLocaleString(countryData.locale);
  return country === 'India'
    ? `${countryData.currencySymbol} ${formatted}`
    : `${formatted} ${countryData.currencySymbol}`;
};

export const formatChartTick = (value, country = 'India') => {
  const countryData = data[country];
  if (country === 'India') {
    return `${countryData.currencySymbol}${(value / 100000).toFixed(1)}L`;
  }
  return `${(value / 1000).toFixed(0)}k ${countryData.currencySymbol}`;
};
