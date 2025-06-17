import { useState, useEffect, useRef } from "react";
import SearchForm from "../components/ai/SearchForm";
import PropertyCard from "../components/ai/PropertyCard";
import CityPriceAnalysisDisplay from "../components/ai/LocationTrends"; 
import AnalysisDisplay from "../components/ai/AnalysisDisplay";
import PriceTrendDisplay from "../components/ai/PriceTrendDisplay"; 
import CollapsibleCard from "../components/ai/CollapsibleCard"; // Import the new CollapsibleCard component
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
  BarChart3, // Added for PriceTrendDisplay icon
  Info,      // Added for CityPriceAnalysisDisplay icon
} from "lucide-react";
import PropTypes from "prop-types";
import AiHubSEO from "../components/SEO/AiHubSEO";
import StructuredData from "../components/SEO/StructuredData";
import { Search } from "lucide-react"; 

const AIPropertyHub = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [loadingTime, setLoadingTime] = useState(0);
  const [properties, setProperties] = useState([]);
  const [propertyAnalysis, setPropertyAnalysis] = useState("");
  const [locationAnalysis, setLocationAnalysis] = useState(""); 
  const [priceTrendData, setPriceTrendData] = useState(null); 
  const [priceTrendError, setPriceTrendError] = useState(""); 
  const [priceTrendLoading, setPriceTrendLoading] = useState(false); 
  const [currentSearchParams, setCurrentSearchParams] = useState(null); 
  const [searchError, setSearchError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isDeployedVersion, setIsDeployedVersion] = useState(false);
  const contentRef = useRef(null);
  const sliderRef = useRef(null); 

  // Timer for loading state
  useEffect(() => {
    // Check if we're running in a deployed environment (not localhost)
    const isDeployed =
      window.location.hostname !== "localhost" &&
      !window.location.hostname.startsWith("192.168") &&
      !window.location.hostname.startsWith("127.0.0.1");
    setIsDeployedVersion(isDeployed);

    document.title =
      "Aqarat AI | EmiratEstate - Real Estate Market Analysis";
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

      // Scroll to results when loading completes and results are available
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
    setCurrentSearchParams(searchParams); // Store the current search parameters
    setIsLoading(true);
    setSearchError("");
    setSearchPerformed(true);
    setLoadingTime(0);
    setProperties([]); // Clear previous results
    setPropertyAnalysis("");
    setLocationAnalysis("");
    setPriceTrendData(null); // Clear previous price trend data
    setPriceTrendError("");

    try {
      // Fetch property data
      setLoadingStage("properties");
      const propertyResponse = await searchProperties(searchParams);
      console.log("Frontend Property Response:", propertyResponse); 
      setProperties(propertyResponse.properties || []);
      setPropertyAnalysis(propertyResponse.analysis || "");

      // Fetch location trends and price trend data for the same city
      setLoadingStage("locations"); // This stage now covers city price analysis
      setPriceTrendLoading(true);
      const cityPriceAnalysisResponse = await getCityPriceAnalysis(searchParams.city);
      console.log("Frontend City Price Analysis Response Raw:", cityPriceAnalysisResponse); 
      
      if (cityPriceAnalysisResponse && cityPriceAnalysisResponse.success) {
        if (cityPriceAnalysisResponse.detailedPriceTrend) {
          setPriceTrendData(cityPriceAnalysisResponse.detailedPriceTrend);
          console.log("Detailed Price Trend Data to be set:", cityPriceAnalysisResponse.detailedPriceTrend);
        } else {
          console.log("Detailed price trend data not found in response.");
          setPriceTrendData(null); // Ensure it's null if not found
        }
        // The AI analysis for the city's price trend is now in cityPriceAnalysisResponse.analysis
        setLocationAnalysis(cityPriceAnalysisResponse.analysis || ""); 
        console.log("City Price Trend Analysis (textual) to be set:", cityPriceAnalysisResponse.analysis);
      } else {
        const errorMsg = cityPriceAnalysisResponse?.message || "Failed to fetch city price analysis.";
        console.error("Error in city price analysis response:", errorMsg);
        setPriceTrendError(errorMsg);
        setLocationAnalysis(""); // Clear analysis on error
        setPriceTrendData(null);
      }

    } catch (error) {
      console.error("Error during search:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to fetch data. Please try again.";
      setSearchError(errorMsg);
      setPriceTrendError(errorMsg); // Also set price trend error
    } finally {
      setIsLoading(false);
      setPriceTrendLoading(false);
    }
  };

  // Enhanced loading indicator component
  const renderLoadingIndicator = () => {
    const getLoadingMessage = () => {
      if (loadingTime < 5) {
        return "Extracting property data from various sources...";
      } else if (loadingTime < 15) {
        return "Loading AI model for comprehensive analysis...";
      } else if (loadingTime < 30) {
        return "AI is analyzing property details and market conditions...";
      } else {
        return "Finalizing results and generating insights for you...";
      }
    };

    const getProgressWidth = () => {
      // Calculate progress percentage (max 95% so it doesn't look complete)
      const progress = Math.min(95, (loadingTime / 45) * 100);
      return `${progress}%`;
    };

    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12">
        {/* Loading animation with property icon - adjusted for better mobile view */}
        <div className="relative mb-8 sm:mb-12 pt-12 sm:pt-16">
          {/* Main circle - smaller on mobile */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center relative shadow-lg shadow-orange-500/30">
            {loadingStage === "properties" ? (
              <Building className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
            ) : (
              <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
            )}
          </div>

          {/* Responsive pulse circle */}
          <div className="absolute bottom-0 top-10 -right-4 sm:-right-6 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-orange-500 opacity-30 pulse-animation"></div>

          {/* Responsive orbiting dots */}
          <div className="absolute top-12 sm:top-16 left-1/2 w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-white shadow-md shadow-orange-300 orbit-animation"></div>
          <div className="absolute top-1/2 right-0 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-orange-200 orbit-animation-reverse"></div>
          <div className="absolute bottom-0 left-1/2 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-orange-200 orbit-animation-slow"></div>
        </div>

        {/* Custom animations */}
        <style jsx global>{`
          @keyframes orbit {
            0% {
              transform: rotate(0deg) translateX(35px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(35px) rotate(-360deg);
            }
          }

          @keyframes orbit-reverse {
            0% {
              transform: rotate(0deg) translateX(40px) rotate(0deg);
            }
            100% {
              transform: rotate(-360deg) translateX(40px) rotate(-360deg);
            }
          }

          @keyframes orbit-slow {
            0% {
              transform: rotate(180deg) translateX(40px) rotate(-180deg);
            }
            100% {
              transform: rotate(-180deg) translateX(40px) rotate(180deg);
            }
          }

          @keyframes pulse {
            0% {
              transform: scale(0.8);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.2;
            }
            100% {
              transform: scale(0.8);
              opacity: 0.3;
            }
          }

          .orbit-animation {
            transform: translateX(-50%);
            animation: orbit 3s linear infinite;
          }

          .orbit-animation-reverse {
            transform: translateX(50%);
            animation: orbit-reverse 4s linear infinite;
          }

          .orbit-animation-slow {
            transform: translateX(-50%) translateY(50%);
            animation: orbit-slow 5s linear infinite;
          }

          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }

          @media (max-width: 640px) {
            @keyframes orbit {
              0% {
                transform: rotate(0deg) translateX(25px) rotate(0deg);
              }
              100% {
                transform: rotate(360deg) translateX(25px) rotate(-360deg);
              }
            }
            @keyframes orbit-reverse {
              0% {
                transform: rotate(0deg) translateX(30px) rotate(0deg);
              }
              100% {
                transform: rotate(-360deg) translateX(30px) rotate(-360deg);
              }
            }
            @keyframes orbit-slow {
              0% {
                transform: rotate(180deg) translateX(30px) rotate(-180deg);
              }
              100% {
                transform: rotate(-180deg) translateX(30px) rotate(180deg);
              }
            }
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

        {/* Responsive progress bar */}
        <div className="w-full max-w-xs sm:max-w-md h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden mb-6 shadow-inner px-4 sm:px-0">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 rounded-full"
            style={{ width: getProgressWidth() }}
          ></div>
        </div>

        {/* Loading context message */}
        <div className="bg-orange-50 border border-orange-100 p-4 sm:p-5 rounded-lg max-w-xs sm:max-w-md shadow-md mx-4 sm:mx-0">
          <div className="flex items-center mb-3">
            <div className="mr-3">
              {loadingTime < 15 ? (
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              ) : (
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              )}
            </div>
            <h4 className="font-medium text-orange-800 text-sm sm:text-base">
              AI Processing
            </h4>
          </div>
          <p className="text-orange-700 text-xs sm:text-sm">
            {loadingTime < 20
              ? "Our AI is searching for properties that match your exact requirements and analyzing local market data."
              : "We\'re using advanced algorithms to evaluate property quality, value for money, and investment potential."}
          </p>
          {loadingTime > 15 && (
            <div className="mt-3 pt-3 border-t border-orange-100">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-600 rounded-full animate-pulse"></div>
                <p className="text-xs text-orange-600 font-medium">
                  Deep analysis takes time for quality insights
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    ); 
  }; // Ensured renderLoadingIndicator is correctly closed

  const sliderSettings = {
    dots: true,
    infinite: false, // Set to false if you don't want infinite looping, true if you do
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,        // Enable autoplay
    autoplaySpeed: 3000,   // Autoplay speed in milliseconds (e.g., 3 seconds)
    pauseOnHover: true,    // Pause autoplay on hover
    responsive: [
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Main component return starts after this
  return (
    <>
      <AiHubSEO />
      <StructuredData />
      {/* Apply scaling to the main container */}
      <main 
        className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 via-white text-gray-800 antialiased"
        style={{
          transform: 'scale(0.75)', // Changed from 0.80 to 0.75
          transformOrigin: 'top left',
          width: '133.33%', // 100 / 0.75, to counteract the scale effect on width
          height: '133.33%', // 100 / 0.75, to counteract the scale effect on height
          overflow: 'auto' // Add scrollbars if content overflows the scaled viewport
        }}
      >
        {/* Full-page loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            {/* The existing renderLoadingIndicator is called here. It already has centering and styling. */}
            {renderLoadingIndicator()} 
          </div>
        )}

        {/* Changed from "container" to "w-full max-w-screen-2xl" to allow wider columns */}
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 sm:pb-28"> 
          {/* Hero Content Grid: Changed to md:grid-cols-7 to adjust 3rd column width */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 sm:gap-6 items-stretch mb-4 sm:mb-8"> 
            
            {/* Column 1: Title and Image - md:col-span-2 */}
            <div className="flex flex-col md:col-span-2">
              {/* Increased top margin further to lower the text more */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mt-12 sm:mt-16 mb-2 sm:mb-3 text-left"> {/* Increased top margin to lower the text */}
                Explore & Find
                <br />
                your <span className="text-orange-500">Dream</span>
                <br />
                <span className="text-orange-500">home</span>
              </h1>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl aspect-[4/3] mt-auto"> {/* Changed border radius */}
                <img
                  src="https://framerusercontent.com/images/5QUUPPX8KvTI2vwKGRCYLHc7w.png?scale-down-to-1024"
                  alt="Modern house exterior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Column 2: Video - md:col-span-2 */}
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

            {/* Column 3: Form and AI Info Section - md:col-span-3 */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl h-full flex flex-col justify-between md:col-span-3"> 
              <div> {/* Wrapper for content */}
                <div className="mb-6">
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-700 mb-3 flex items-center">
                    <Search className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-orange-500" />
                    AI-Powered Search
                  </h2>
                  <p className="text-xs lg:text-sm text-gray-600 mb-4">
                    "Unlock data-driven insights for your property decisions. Aqarat AI
                    helps you understand the market like never before."
                  </p>
                  <ul className="space-y-1.5 text-xs lg:text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-0.5">&#10003;</span>
                      <span>Analyze thousands of listings.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-0.5">&#10003;</span>
                      <span>Get AI market trend analysis.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-0.5">&#10003;</span>
                      <span>Discover investment potential.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-0.5">&#10003;</span>
                      <span>Personalized property matching.</span>
                    </li>
                  </ul>
                </div>

                {isDeployedVersion ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <AlertCircle className="w-8 h-8 text-amber-500" />
                      <div>
                        <h3 className="text-sm font-semibold text-amber-700 mb-1">
                          AI Features Limited Online
                        </h3>
                        <p className="text-xs text-amber-600 mb-2">
                          AI features are only available locally.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-1.5 justify-center">
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
          {/* End of Hero Section */}

          {/* GitHub Link and Download Button for Deployed Version */}
          {isDeployedVersion && searchError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 sm:mb-8 max-w-4xl mx-auto border border-red-100 shadow-sm">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-sm sm:text-base">{searchError}</p>
              </div>
            </div>
          )}

          {/* Results Section - This will be a new grid for properties, price trends, and location insights */}
          {searchPerformed && !isLoading && !searchError && (
            <div ref={contentRef} className="mt-8 sm:mt-12">
              {/* Main Results Grid - Changed to lg:grid-cols-3 for a 2/3 and 1/3 split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
                
                {/* Left Column: Property Results Carousel and Price Trend Display (lg:col-span-2) */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                  {/* Property Results Carousel */}
                  {properties.length > 0 && (
                    <CollapsibleCard 
                      title="Property Results"
                      icon={Building} // Pass the component type directly
                      defaultOpen={true}
                    >
                      <Slider {...sliderSettings} ref={sliderRef} className="mb-6 sm:mb-8 pt-4">
                        {properties.map((property, index) => (
                          <div key={index} className="px-1.5 sm:px-2">
                            <PropertyCard property={property} />
                          </div>
                        ))}
                      </Slider>
                    </CollapsibleCard>
                  )}
                  {properties.length === 0 && !isLoading && (
                     <CollapsibleCard 
                        title="Property Results"
                        icon={AlertCircle} // Pass the component type directly
                        defaultOpen={true}
                      >
                        <div className="text-center py-6">
                          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-white mb-2">No Properties Found</h3>
                          <p className="text-gray-400">We couldn't find properties matching your criteria. Try adjusting your search.</p>
                        </div>
                    </CollapsibleCard>
                  )}

                  {/* Price Trend Display - Appears below property results */}
                  {(priceTrendData || priceTrendError || priceTrendLoading) && (
                    <CollapsibleCard 
                      title="Price Trends Visualization"
                      icon={BarChart3} // Pass the component type directly
                      defaultOpen={true} // Or false, depending on preference
                    >
                      <PriceTrendDisplay 
                        city={currentSearchParams?.city}
                        trendData={priceTrendData}
                        loading={priceTrendLoading}
                        error={priceTrendError}
                      />
                    </CollapsibleCard>
                  )}
                </div>

                {/* Right Column: Analysis Cards (lg:col-span-1) */}
                <div className="lg:col-span-1 space-y-6 sm:space-y-8">
                  {/* Expert Property Analysis */}
                  {propertyAnalysis && (
                    <CollapsibleCard 
                      title="Expert Property Analysis"
                      icon={Brain} // Pass the component type directly
                    >
                      <AnalysisDisplay analysis={propertyAnalysis} />
                    </CollapsibleCard>
                  )}

                  {/* Prices Insights (formerly Location Insights / Expert Trend Analysis for city price trend) */}
                  {(locationAnalysis || priceTrendData) && (
                    <CollapsibleCard 
                      title="Prices Insights"
                      icon={Info} // Pass the component type directly
                    >
                      <CityPriceAnalysisDisplay 
                        priceTrendData={priceTrendData} // Pass the structured data if needed by the component
                        analysis={locationAnalysis} // Pass the AI-generated textual analysis
                        city={currentSearchParams?.city} 
                      />
                    </CollapsibleCard>
                  )}

                  {/* Note: The original "Expert Trend Analysis" card that displayed `locationAnalysis` 
                       is now effectively combined into "Prices Insights" if `locationAnalysis` 
                       is the AI text for the city's price trend. 
                       If `locationAnalysis` was meant for something else, this might need adjustment.
                       Assuming `locationAnalysis` is the textual AI summary for the city's price trend data.
                  */}
                </div>
              </div>
            </div>
          )}

          {searchPerformed && !isLoading && searchError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 sm:mb-8 max-w-4xl mx-auto border border-red-100 shadow-sm">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-sm sm:text-base">{searchError}</p>
              </div>
            </div>
          )}

          {(!isLoading && !searchPerformed) || isDeployedVersion ? (
            <div className="bg-white p-5 sm:p-8 rounded-lg sm:rounded-xl shadow-md max-w-4xl mx-auto text-center">
              <div className="mb-5 sm:mb-6">
                <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-orange-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  Welcome to Aqarat AI
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Our advanced AI analyzes real estate data to help you make
                  better property decisions
                </p>

                {isDeployedVersion && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
                    <p>
                      <strong>Note:</strong> AI features are currently only
                      available in the local development environment due to API
                      key restrictions.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col items-center sm:flex-row sm:justify-center sm:items-stretch gap-4 sm:gap-6">
                {/* <FeatureCard
                  icon={<Building className="w-5 h-5 sm:w-6 sm:h-6" />}
                  title="Property Analysis"
                  description="Discover properties matching your requirements with detailed AI insights"
                /> */}
                <FeatureCard
                  icon={<MapPin className="w-5 h-5 sm:w-6 sm:h-6" />}
                  title="Location Trends"
                  description="Evaluate neighborhood growth, rental yields, and price appreciation"
                />
                <FeatureCard
                  icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
                  title="Investment Insights"
                  description="Get expert recommendations on property investment potential"
                />
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
};

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
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default AIPropertyHub;

/* Custom Global Styles for Carousel Arrows */
<style jsx global>{`
  .slick-prev,
  .slick-next {
    z-index: 10; // Ensure arrows are above cards
    width: 40px; // Increase width for better clickability
    height: 40px; // Increase height
    background-color: rgba(255, 165, 0, 0.7) !important; // Orange, slightly transparent
    border-radius: 50%;
    display: flex !important; /* Override default display */
    align-items: center !important;
    justify-content: center !important;
    transition: background-color 0.3s ease;
  }

  .slick-prev:hover,
  .slick-next:hover {
    background-color: rgba(255, 165, 0, 1) !important; // Solid orange on hover
  }

  .slick-prev::before,
  .slick-next::before {
    font-size: 20px !important; // Adjust arrow icon size
    color: white !important; // Arrow icon color
    opacity: 1 !important; // Ensure icon is fully visible
  }

  .slick-prev {
    left: -15px !important; // Adjust position if needed
  }

  .slick-next {
    right: -15px !important; // Adjust position if needed
  }
  
  /* Ensure proper spacing for slides if not using padding on the Slider component directly */
  .property-carousel .slick-slide > div {
    margin: 0 10px; /* Adjust horizontal margin between slides */
  }
  .property-carousel .slick-list {
    margin: 0 -10px; /* Compensate for slide margins */
  }

  /* Responsive adjustments for arrows */
  @media (max-width: 768px) { /* md breakpoint */
    .slick-prev,
    .slick-next {
      width: 30px;
      height: 30px;
    }
    .slick-prev::before,
    .slick-next::before {
      font-size: 16px !important;
    }
    .slick-prev {
      left: 5px !important;
    }
    .slick-next {
      right: 5px !important;
    }
    .property-carousel .slick-slide > div {
      margin: 0 5px; /* Adjust horizontal margin between slides for smaller screens */
    }
    .property-carousel .slick-list {
      margin: 0 -5px; /* Compensate for slide margins */
    }
  }
`}</style>
