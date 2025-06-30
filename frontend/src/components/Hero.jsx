import React, { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Search, MapPin, ArrowRight, Building } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import golfHeroImage from "../assets/images/golf.jpg"; // Changed import

const popularLocations = [
  "Jumeirah",
  "Downtown Dubai",
  "Arabian Ranches 2",
  "Palm Jumeirah",
  "Dubai Marina",
];

export const AnimatedContainer = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const directions = {
    vertical: "Y",
    horizontal: "X",
  };

  const springProps = useSpring({
    from: {
      transform: `translate${directions[direction]}(${
        reverse ? `-${distance}px` : `${distance}px`
      })`,
    },
    to: inView ? { transform: `translate${directions[direction]}(0px)` } : {},
    config: { tension: 50, friction: 25 },
  });

  return (
    <animated.div ref={ref} style={springProps}>
      {children}
    </animated.div>
  );
};

const Hero = ({ onEmiratEstateGPTClick }) => {
  // Added onEmiratEstateGPTClick prop
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchType, setSearchType] = useState("buy"); // 'buy' or 'rent'
  const [activeAvailabilityFilter, setActiveAvailabilityFilter] =
    useState("All"); // Added state for availability filter

  const handleSubmit = (location = searchQuery) => {
    navigate(
      `/properties?type=${searchType}&location=${encodeURIComponent(location)}`
    );
  };

  return (
    <AnimatedContainer distance={50} direction="vertical">
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute top-8 left-8 z-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="p-1.5 rounded-lg"
            >
              <Building className="w-8 h-8 text-white" />
            </motion.div>
            <span className="text-3xl font-bold text-white">EmiratEstate</span>
          </Link>
        </div>
        {/* Background Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${golfHeroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </motion.div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
              {/* <RadialGradient
                  gradient={["circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%"]}
                > */}
              Find Your Perfect
              <br />
              <span className="text-white">Living Space</span>
              {/* </RadialGradient> */}
            </h1>

            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-white">
              Discover your dream home in the most sought-after locations
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            // className="relative max-w-md mx-auto" // Adjusted for wider layout
            className="relative max-w-3xl mx-auto" // Made wider
          >
            {/* Search bar container */}
            <div className="relative max-w-3xl mx-auto">
              {/* The actual search box */}
              <div className="p-4 bg-white rounded-xl shadow-2xl max-w-2xl mx-auto">
                {" "}
                {/* Added max-w-2xl and mx-auto */}
                {/* Buy/Rent Toggle */}
                <div className="flex mb-4">
                  <button
                    onClick={() => setSearchType("buy")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                        ${
                          searchType === "buy"
                            ? "bg-orange-100 text-orange-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setSearchType("rent")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                        ${
                          searchType === "rent"
                            ? "bg-orange-100 text-orange-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                  >
                    Rent
                  </button>
                </div>
                {/* Location Input and Search Button Container */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                  {/* Location Input */}
                  <div className="relative flex-grow w-full sm:w-auto">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      // onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // To allow click on suggestions
                      placeholder="Enter location"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm bg-white"
                    />
                    {/* Location Suggestions will be handled below or integrated if needed */}
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={() => handleSubmit()}
                    className="w-full sm:w-auto bg-orange-500 text-white px-8 py-2.5 rounded-lg hover:bg-orange-600
                        transition-colors flex items-center justify-center gap-2 font-medium text-sm shadow-md hover:shadow-lg"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
                {/* Second Row of Filters - MOVED INSIDE */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => setActiveAvailabilityFilter("All")}
                      className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                        activeAvailabilityFilter === "All"
                          ? "bg-orange-100 text-orange-700"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      All
                    </button>{" "}
                    {/* Increased py-0.5 to py-1 */}
                    <button
                      onClick={() => setActiveAvailabilityFilter("Ready")}
                      className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                        activeAvailabilityFilter === "Ready"
                          ? "bg-orange-100 text-orange-700"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Ready
                    </button>{" "}
                    {/* Increased py-0.5 to py-1 */}
                    <button
                      onClick={() => setActiveAvailabilityFilter("Off-Plan")}
                      className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                        activeAvailabilityFilter === "Off-Plan"
                          ? "bg-orange-100 text-orange-700"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Off-Plan
                    </button>{" "}
                    {/* Increased py-0.5 to py-1 */}
                  </div>
                  <select className="p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-xs text-gray-900">
                    {" "}
                    {/* Added text-gray-900 */} {/* Changed p-1.5 to p-2 */}
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Land</option>
                  </select>
                  <select className="p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-xs text-gray-900">
                    {" "}
                    {/* Added text-gray-900 */} {/* Changed p-1.5 to p-2 */}
                    <option>Beds & Baths</option>
                    <option>1 Bed</option>
                    <option>2 Beds</option>
                    <option>3 Beds</option>
                    <option>4+ Beds</option>
                  </select>
                  <select className="p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-xs text-gray-900">
                    {" "}
                    {/* Added text-gray-900 */} {/* Changed p-1.5 to p-2 */}
                    <option>Price (AED)</option>
                    <option>0 - 500,000</option>
                    <option>500,000 - 1,000,000</option>
                    <option>1,000,000 - 2,000,000</option>
                    <option>2,000,000+</option>
                  </select>
                </div>
                {/* EmiratEstateGPT Banner - MOVED HERE */}
                <div className="mt-4 text-center">
                  {" "}
                  {/* Adjusted margin from mt-6 to mt-4 */}
                  <p className="text-xs text-gray-600">
                    {" "}
                    {/* Adjusted text size to xs */}
                    Want to find out more about UAE real estate using AI?{" "}
                    <button
                      onClick={onEmiratEstateGPTClick}
                      className="text-orange-600 font-semibold hover:underline focus:outline-none"
                    >
                      Try EmiratEstateGPT
                    </button>
                  </p>
                </div>
              </div>
              {/* EmiratEstateGPT Banner REMOVED FROM PREVIOUS LOCATION */}
            </div>

            {/* Location Suggestions */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg divide-y divide-gray-100 overflow-hidden"
                >
                  <div className="p-2">
                    <h3 className="text-xs font-medium text-gray-500 px-3 mb-2">
                      Popular Locations
                    </h3>
                    {popularLocations.map((location) => (
                      <button
                        key={location}
                        onClick={() => {
                          setSearchQuery(location);
                          handleSubmit(location);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center 
                            justify-between text-gray-700 transition-colors"
                      >
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{location}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </AnimatedContainer>
  );
};

export default Hero;
