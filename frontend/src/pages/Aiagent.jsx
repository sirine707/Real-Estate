import { useState, useEffect, useRef } from "react";
import SearchForm from "../components/ai/SearchForm";
import PropertyCard from "../components/ai/PropertyCard";
import CityPriceAnalysisDisplay from "../components/ai/LocationTrends";
import PriceTrendDisplay from "../components/ai/PriceTrendDisplay";
import CollapsibleCard from "../components/ai/CollapsibleCard";
import { searchProperties, getCityPriceAnalysis } from "../services/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Building,
  MapPin,
  TrendingUp,
  Brain,
  AlertCircle,
  Github,
  Download,
  BarChart3,
  Info,
  Search,
  Newspaper,
} from "lucide-react";
import PropTypes from "prop-types";
import AiHubSEO from "../components/SEO/AiHubSEO";
import StructuredData from "../components/SEO/StructuredData";

const AIPropertyHub = () => {
  const [properties, setProperties] = useState([]);
  const [marketArticles, setMarketArticles] = useState([]);
  const [currentSearchParams, setCurrentSearchParams] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [loadingTime, setLoadingTime] = useState(0);
  const [isDeployedVersion, setIsDeployedVersion] = useState(false);
  const contentRef = useRef(null);
  const sliderRef = useRef(null);

  // Check if we're running in a deployed environment
  useEffect(() => {
    const isDeployed =
      window.location.hostname !== "localhost" &&
      !window.location.hostname.startsWith("192.168") &&
      !window.location.hostname.startsWith("127.0.0.1");
    setIsDeployedVersion(isDeployed);
    document.title = "Aqarat AI | EmiratEstate - Real Estate Market Analysis";
  }, []);

  // Timer for loading state
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setLoadingTime(0);
      setLoadingStage("");
      if (searchPerformed && contentRef.current) {
        setTimeout(() => {
          contentRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
    return () => clearInterval(interval);
  }, [isLoading, searchPerformed]);

  const handleSearch = async (searchParams) => {
    if (isDeployedVersion) {
      setSearchError(
        "AI features are only available in the local development environment. Please download the repository to use this feature."
      );
      return;
    }

    setCurrentSearchParams(searchParams);
    setIsLoading(true);
    setSearchError("");
    setSearchPerformed(true);
    setLoadingTime(0);
    setProperties([]);
    setMarketArticles([]);

    try {
      setLoadingStage("properties");
      const propertyResponse = await searchProperties(searchParams);
      setProperties(propertyResponse.properties || []);

      setLoadingStage("locations");
      const response = await getCityPriceAnalysis(searchParams.city);

      console.log("Market Articles Response:", response);

      if (response && response.success) {
        setMarketArticles(response.articles || []);
        setSearchError("");
      } else {
        const errorMsg =
          response?.message || "Failed to fetch market insights.";
        console.error("Error:", errorMsg, "Raw response was:", response);
        setSearchError(errorMsg);
        setMarketArticles([]);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setSearchError(error.message || "An error occurred during search");
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoadingIndicator = () => {
    const getLoadingMessage = () => {
      if (loadingTime < 5) return "Extracting property data...";
      else if (loadingTime < 15) return "Loading AI model...";
      else if (loadingTime < 30)
        return "Analyzing details and market conditions...";
      else return "Finalizing insights...";
    };

    const getProgressWidth = () => {
      const progress = Math.min(95, (loadingTime / 45) * 100);
      return `${progress}%`;
    };

    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12">
        <div className="relative mb-8 sm:mb-12 pt-12 sm:pt-16">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            {loadingStage === "properties" ? (
              <Building className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
            ) : (
              <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
            )}
          </div>
        </div>

        <style jsx global>{`
          @keyframes orbit {
            0% {
              transform: rotate(0deg) translateX(35px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(35px) rotate(-360deg);
            }
          }
          .orbit-animation {
            animation: orbit 3s linear infinite;
          }
        `}</style>

        <div className="text-center mb-6 max-w-lg px-4">
          <h3 className="text-xl sm:text-2xl font-medium text-gray-800 mb-3 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            {loadingStage === "properties"
              ? "Finding Ideal Properties"
              : "Analyzing Market Trends"}
          </h3>
          <p className="text-white text-base sm:text-lg">
            {getLoadingMessage()}
          </p>
        </div>

        <div className="w-full max-w-xs sm:max-w-md h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden mb-6 shadow-inner px-4 sm:px-0">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 rounded-full"
            style={{ width: getProgressWidth() }}
          ></div>
        </div>
      </div>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      <AiHubSEO />
      <StructuredData />

      {/* Apply 76% zoom out on the entire page */}
      <main
        className="bg-gradient-to-br from-gray-100 to-blue-50 via-white text-gray-800 antialiased"
        style={{
          transform: "scale(0.76)",
          transformOrigin: "top left",
          width: "131.58%", // 1 / 0.76 = 1.3158
          height: "131.58%",
          minHeight: "131.58vh",
          overflow: "visible",
        }}
      >
        {/* Full-page loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            {renderLoadingIndicator()}
          </div>
        )}

        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 sm:pb-28">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 sm:gap-6 items-stretch mb-4 sm:mb-8">
            {/* Title & Image */}
            <div className="flex flex-col md:col-span-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mt-12 sm:mt-16 mb-2 sm:mb-3 text-left">
                Explore & Find <br /> your{" "}
                <span className="text-orange-500">Dream</span>{" "}
                <span className="text-orange-500">home</span>
              </h1>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl aspect-[4/3] mt-auto">
                <img
                  src="https://framerusercontent.com/images/5QUUPPX8KvTI2vwKGRCYLHc7w.png?scale-down-to-1024"
                  alt="House exterior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Video */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl flex md:col-span-2">
              <video
                src="https://framerusercontent.com/assets/0BVczrPw7yH6qSj2ZOLQNujmUnk.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl h-full flex flex-col justify-between md:col-span-3">
              <div>
                <div className="mb-6">
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-700 mb-3 flex items-center">
                    <Search className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-orange-500" />{" "}
                    AI-Powered Search
                  </h2>
                  <p className="text-xs lg:text-sm text-gray-600 mb-4">
                    Unlock data-driven insights for your property decisions.
                  </p>
                  <ul className="space-y-1.5 text-xs lg:text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                      <span>Analyze thousands of listings.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                      <span>Get AI market trend analysis.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                      <span>Discover investment potential.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                      <span>Personalized property matching.</span>
                    </li>
                  </ul>
                </div>

                {isDeployedVersion ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <AlertCircle className="w-8 h-8 text-amber-500" />
                      <div>
                        <h3 className="text-sm font-semibold text-amber-700">
                          AI Features Limited Online
                        </h3>
                        <p className="text-xs text-amber-600">
                          AI features are only available locally.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-1.5 justify-center mt-2">
                          <a
                            href="https://github.com/AAYUSH412/Real-Estate-Website"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                          >
                            <Github className="w-3 h-3" />
                            <span>GitHub</span>
                          </a>
                          <a
                            href="https://github.com/AAYUSH412/Real-Estate-Website/archive/refs/heads/main.zip"
                            className="flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <SearchForm onSearch={handleSearch} isLoading={isLoading} />
                )}
              </div>
            </div>
          </div>

          {/* Results Section - This will be a new grid for properties, price trends, and location insights */}
          {searchPerformed && !isLoading && !searchError && (
            <div ref={contentRef} className="mt-8 sm:mt-12 w-full">
              <div className="flex flex-col gap-6 sm:gap-8 w-full">
                {/* Property Results */}
                {properties.length > 0 && (
                  <CollapsibleCard
                    title="Property Results"
                    icon={Building}
                    defaultOpen={true}
                    className="w-full"
                  >
                    <ul className="space-y-4 w-full">
                      {properties.map((property, index) => (
                        <PropertyCard key={index} property={property} />
                      ))}
                    </ul>
                  </CollapsibleCard>
                )}
                {/* Market Insights */}
                {marketArticles.length > 0 && (
                  <CollapsibleCard
                    title="Market Insights"
                    icon={Newspaper}
                    className="w-full"
                  >
                    <CityPriceAnalysisDisplay
                      articles={marketArticles}
                      city={currentSearchParams?.city}
                    />
                  </CollapsibleCard>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Carousel Arrows Styling */}
      <style jsx global>{`
        .slick-prev,
        .slick-next {
          z-index: 10;
          width: 40px;
          height: 40px;
          background-color: rgba(255, 165, 0, 0.7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease;
        }
        .slick-prev:hover,
        .slick-next:hover {
          background-color: #ffaa00;
        }
        .slick-prev::before,
        .slick-next::before {
          font-size: 20px;
          color: white;
          opacity: 1;
        }
        .slick-prev {
          left: -15px;
        }
        .slick-next {
          right: -15px;
        }
      `}</style>
    </>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-100">
    <div className="text-orange-600 mb-2 sm:mb-3">{icon}</div>
    <h3 className="font-semibold text-gray-800 mb-1.5 sm:mb-2 text-sm sm:text-base">
      {title}
    </h3>
    <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
  </div>
);

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default AIPropertyHub;
