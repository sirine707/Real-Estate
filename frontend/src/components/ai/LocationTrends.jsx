import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, Newspaper } from "lucide-react";
import { useState } from "react";
import ArticlePopup from "./ArticlePopup";

// This component displays the AI analysis summary and a list of related articles.
const CityPriceAnalysisDisplay = ({ city, articles = [] }) => {
  const [selectedArticleUrl, setSelectedArticleUrl] = useState(null);
  const [selectedArticleDesc, setSelectedArticleDesc] = useState("");

  if (articles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center border border-gray-200"
      >
        <div className="flex flex-col items-center justify-center py-8 sm:py-10">
          <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-3 sm:mb-4" />
          <p className="text-gray-500 font-medium text-lg">
            No market insights available for this city.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Please try another search or check back later.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-5 sm:p-6 rounded-xl shadow-xl border border-gray-100 h-full flex flex-col gap-6"
    >
      <div className="flex items-center">
        <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mr-3.5 shadow-md">
          <Newspaper className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Market Insights for{" "}
          <span className="text-orange-600">{city || "Selected City"}</span>
        </h2>
      </div>

      {/* Articles Section */}
      <div className="space-y-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className="group relative p-5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => {
              setSelectedArticleUrl(article.url);
              setSelectedArticleDesc(article.description);
            }}
          >
            <div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                {article.description}
              </p>
              <div className="flex justify-between items-center">
                <div
                  className="text-sm text-orange-500 flex items-center gap-1.5 hover:text-orange-600 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(article.url, "_blank", "noopener,noreferrer");
                  }}
                >
                  Read full article{" "}
                  <ExternalLink className="w-4 h-4 inline-block" />
                </div>
                <p className="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-all duration-200">
                  Click card for AI summary
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gray-900 bg-opacity-0 group-hover:bg-opacity-5 transition-colors rounded-lg pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Article Popup */}
      {selectedArticleUrl && (
        <ArticlePopup
          url={selectedArticleUrl}
          description={selectedArticleDesc}
          onClose={() => setSelectedArticleUrl(null)}
        />
      )}
    </motion.div>
  );
};

CityPriceAnalysisDisplay.propTypes = {
  city: PropTypes.string,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
};

export default CityPriceAnalysisDisplay;
