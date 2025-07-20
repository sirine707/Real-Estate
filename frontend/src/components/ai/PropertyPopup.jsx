import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Building,
  MapPin,
  TrendingUp,
  Bot,
} from "lucide-react";

const PropertyPopup = ({ isOpen, onClose, properties, analysis, city }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when popup opens or properties change
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen, properties]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, properties.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + properties.length) % properties.length
    );
  };

  if (!isOpen || !properties || properties.length === 0) return null;

  const currentProperty = properties[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold">
                    Property Recommendations for {city}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Property Counter */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm opacity-90">
                    Property {currentIndex + 1} of {properties.length}
                  </span>
                </div>

                {/* Navigation dots */}
                <div className="flex space-x-2">
                  {properties.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-white"
                          : "bg-white bg-opacity-40 hover:bg-opacity-60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Current Property */}
              <div className="p-6">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-orange-500" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        Property Details
                      </h3>
                    </div>
                    <a
                      href={currentProperty.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Property</span>
                    </a>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {currentProperty.description}
                  </p>
                </div>

                {/* AI Analysis */}
                {analysis && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Bot className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        AI Market Analysis
                      </h3>
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>

                    <div
                      className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: analysis.replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="text-blue-700 font-semibold">$1</strong>'
                        ),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            {properties.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors z-10"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

PropertyPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
  analysis: PropTypes.string,
  city: PropTypes.string,
};

export default PropertyPopup;
