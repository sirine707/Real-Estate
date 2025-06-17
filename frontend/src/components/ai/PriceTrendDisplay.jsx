// frontend/src/components/ai/PriceTrendDisplay.jsx
import React from 'react';

const PriceTrendDisplay = ({ trendData, city, loading, error }) => {
  if (loading) {
    return <div className="text-center p-4 text-white">Loading price trends...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-400">Error: {error}</div>;
  }

  if (!trendData) {
    return <div className="text-center p-4 text-gray-400">No price trend data available for {city || 'the selected location'}.</div>;
  }

  const parsePrice = (priceStr) => {
    if (!priceStr || typeof priceStr !== 'string') return { currency: '', amount: '', unit: '' };
    // Example: "AED 2,872 /sqft" or "AED 2,872/sqft"
    // Regex to capture currency, amount, and unit, allowing for optional space before /sqft
    const match = priceStr.match(/^([A-Za-z]+)\s*([\d,.]+)\s*(\/sqft|per sqft|\/ Sqft|per Sqft|sqft)?$/i);
    if (match) {
      return {
        currency: match[1] || 'AED', // Default to AED if not captured
        amount: match[2] || '',
        unit: match[3] || '/sqft', // Default to /sqft
      };
    }
    // Fallback for simpler parsing if regex fails
    const parts = priceStr.split(' ');
    return {
      currency: parts[0] || 'AED',
      amount: parts[1] || '',
      unit: parts.length > 2 ? parts.slice(2).join(' ') : '/sqft',
    };
  };
  
  const currentPriceDetails = parsePrice(trendData.current_price_per_sqft);

  return (
    <div className="bg-gray-800 shadow-xl rounded-lg p-6 w-full mx-auto my-4 border border-gray-700">
      {/* Current Price Section */}
      <div className="text-center border-b border-gray-700 pb-4 mb-4">
        <h3 className="text-md font-semibold text-gray-400 uppercase tracking-wider">CURRENT PRICE</h3>
        {trendData.current_price_date && (
          <p className="text-xs text-gray-500">({trendData.current_price_date})</p>
        )}
        <div className="mt-2">
          <span className="text-4xl font-bold text-orange-500">
            {currentPriceDetails.currency} {currentPriceDetails.amount}
          </span>
          {currentPriceDetails.unit && (
            <span className="text-xl text-gray-400">{currentPriceDetails.unit}</span>
          )}
        </div>
      </div>

      {/* Historical Price Section */}
      {trendData.historical_prices && trendData.historical_prices.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-400 uppercase tracking-wider text-center mb-3">
            HISTORICAL PRICE/Sqft
          </h3>
          <ul className="space-y-3">
            {trendData.historical_prices.map((item, index) => {
              const historicalPriceDetails = parsePrice(item.price_per_sqft);
              return (
                <li key={index} className="flex justify-between items-center text-sm bg-gray-750 p-3 rounded-md">
                  <span className="text-gray-300">{item.period}</span>
                  <span className="text-orange-400 font-medium">
                    {historicalPriceDetails.currency} {historicalPriceDetails.amount}
                    {historicalPriceDetails.unit && ` ${historicalPriceDetails.unit}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
       {!trendData.historical_prices || trendData.historical_prices.length === 0 && (
         <p className="text-sm text-gray-500 text-center">No historical price data available.</p>
       )}
    </div>
  );
};

export default PriceTrendDisplay;
