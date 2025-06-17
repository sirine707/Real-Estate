import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Info, AlertCircle, DollarSign, CalendarDays, BarChartHorizontalBig } from 'lucide-react';

// Renamed component to CityPriceAnalysisDisplay
const CityPriceAnalysisDisplay = ({ priceTrendData, analysis, city }) => {

  if (!priceTrendData && !analysis) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center border border-gray-200"
      >
        <div className="flex flex-col items-center justify-center py-8 sm:py-10">
          <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-3 sm:mb-4" />
          <p className="text-gray-500 font-medium">No price analysis available for this city yet.</p>
          <p className="text-sm text-gray-400 mt-2">Please try another search or check back later.</p>
        </div>
      </motion.div>
    );
  }

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === 'N/A') return 'N/A';
    return `${price}`.replace(/AED|\s*million/gi, '').trim() + ' AED'; // Ensures "AED" is appended correctly
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-5 sm:p-6 rounded-xl shadow-xl border border-gray-100 h-full flex flex-col"
    >
      <div className="flex items-center mb-5">
        <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mr-3.5 shadow-md">
          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Price Analysis for <span className="text-orange-600">{city || 'Selected City'}</span>
        </h2>
      </div>

      {/* Current Price Section */}
      {priceTrendData?.current_price_per_sqft && (
        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center text-orange-700 mb-1.5">
            <DollarSign className="w-5 h-5 mr-2" />
            <h3 className="text-md font-medium">Current Market Snapshot</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600">
            {formatPrice(priceTrendData.current_price_per_sqft)}
            <span className="text-sm font-normal text-gray-500 ml-1">per sqft</span>
          </p>
          {priceTrendData.current_price_date && (
            <p className="text-xs text-gray-500 mt-1">As of: {priceTrendData.current_price_date}</p>
          )}
        </div>
      )}

      {/* Historical Prices Section */}
      {priceTrendData?.historical_prices && priceTrendData.historical_prices.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center text-gray-700 mb-2.5">
            <CalendarDays className="w-5 h-5 mr-2 text-gray-500" />
            <h3 className="text-md font-medium">Historical Price Points</h3>
          </div>
          <ul className="space-y-2.5">
            {priceTrendData.historical_prices.map((hp, index) => (
              <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
                <span className="text-sm text-gray-600 font-medium">{hp.period}:</span>
                <span className="text-sm text-gray-800 font-semibold">{formatPrice(hp.price_per_sqft)} <span className="text-xs font-normal text-gray-500">per sqft</span></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Analysis Section */}
      {analysis && (
        <div className="mt-auto pt-5 border-t border-gray-200">
          <div className="flex items-center text-gray-700 mb-3">
            <Info className="w-5 h-5 mr-2 text-orange-500" />
            <h3 className="text-md font-medium">Prices Insights</h3>
          </div>
          <div 
            className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-gray-700"
            dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }}
          />
        </div>
      )}

      {(!priceTrendData?.current_price_per_sqft && (!priceTrendData?.historical_prices || priceTrendData.historical_prices.length === 0) && !analysis) &&
        <div className="flex flex-col items-center justify-center text-center py-6">
          <AlertCircle className="w-8 h-8 text-orange-400 mb-3" />
          <p className="text-gray-600 font-medium">Detailed price trend data or analysis is not available.</p>
          <p className="text-xs text-gray-400 mt-1">This might be due to limited data for the selected area.</p>
        </div>
      }
    </motion.div>
  );
};

CityPriceAnalysisDisplay.propTypes = {
  priceTrendData: PropTypes.shape({
    current_price_per_sqft: PropTypes.string,
    current_price_date: PropTypes.string,
    historical_prices: PropTypes.arrayOf(PropTypes.shape({
      period: PropTypes.string,
      price_per_sqft: PropTypes.string,
    })),
  }),
  analysis: PropTypes.string,
  city: PropTypes.string, // Added city prop for displaying the city name
};

export default CityPriceAnalysisDisplay;