import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize, 
  Heart,
  Eye,
  ArrowRight,
  ArrowLeft, // Added ArrowLeft
  Building,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Backendurl } from '../App';
import PropTypes from "prop-types";

// Sample featured properties for fallback
const sampleProperties = [
  {
    _id: "sample1",
    title: "Luxury Beachfront Villa",
    location: "Palm Jumeirah, Dubai", // Updated location
    price: 25000000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    type: "Villa",
    availability: "Buy",
    image: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
  },
  {
    _id: "sample2",
    title: "Modern Highrise Apartment",
    location: "Downtown Dubai", // Updated location
    price: 18500000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    type: "Apartment",
    availability: "Rent",
    image: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
  },
  {
    _id: "sample3",
    title: "Elegant Marina Townhouse", // Updated title
    location: "Dubai Marina", // Updated location
    price: 12000000,
    beds: 3,
    baths: 3, // Updated baths from 2.5 to 3
    sqft: 2200,
    type: "House",
    availability: "Buy",
    image: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"] // New image URL
  }
];

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  // Removed isFavorite state as the button was removed

  const handleNavigate = () => {
    navigate(`/properties/single/${property._id}`);
  };

  // Removed toggleFavorite function

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer w-full flex flex-col"
      onClick={handleNavigate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Property Image */}
      <div className="relative h-60 md:h-72 w-full rounded-t-xl overflow-hidden"> {/* Added rounded-t-xl and overflow-hidden */}
        <img
          src={property.image[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Property badges - For Sale / For Rent */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-md shadow-md 
            ${property.availability === 'Rent' 
              ? 'bg-blue-500 text-white' // Blue for Rent
              : 'bg-amber-500 text-white'}` // Amber for Sale
            }>
            {property.availability === 'Rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>
        
        {/* Favorite button - Removed as not in the target image */}
        
        {/* View overlay on hover - Removed as not in the target image */}
      </div>
      
      {/* Property Content */}
      <div className="p-5 flex-grow flex flex-col justify-between"> {/* Added flex-grow and flex for content alignment */}
        <div> {/* Wrapper for top content */}
          <div className="flex items-center text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-blue-600" /> {/* Blue icon */}
            <span className="text-sm line-clamp-1">{property.location}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {property.title}
          </h3>
        </div>
        
        {/* Property Features - Aligned to bottom */}
        <div className="flex items-center text-gray-600 text-sm mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center mr-4">
            <BedDouble className="w-4 h-4 text-gray-500 mr-1" />
            <span>{property.beds}</span>
          </div>
          <div className="flex items-center mr-4">
            <Bath className="w-4 h-4 text-gray-500 mr-1" />
            <span>{property.baths}</span>
          </div>
          <div className="flex items-center">
            <Maximize className="w-4 h-4 text-gray-500 mr-1" />
            <span>{property.sqft} sq.ft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Updated to use default parameters directly in the function signature
const PropertiesShow = ({ 
  title: sectionTitle = "Featured Properties", 
  subtitle: sectionSubtitle = "Discover our exclusive selection of premier properties.", 
  showViewAllButton = true 
}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 0 for initial, 1 for next, -1 for prev

  const categories = [
    { id: 'all', label: 'All' }, // Simplified label
    { id: 'apartment', label: 'Apartments' },
    { id: 'villa', label: 'Villas' },
    { id: 'house', label: 'Houses' }
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        // const response = await axios.get(`${Backendurl}/api/properties/search`); // Old endpoint
        const response = await axios.get(`${Backendurl}/api/properties/all`); // New endpoint
        if (response.data.success) {
          setProperties(response.data.properties);
        } else {
          setError(response.data.message || "Failed to fetch properties");
          setProperties(sampleProperties); // Fallback to sample data on error
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(err.message || "An error occurred while fetching properties.");
        setProperties(sampleProperties); // Fallback to sample data on error
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []); // Fetch properties on component mount

  const filteredProperties = activeCategory === 'all' 
    ? properties 
    : properties.filter(property => property.type.toLowerCase() === activeCategory);

  useEffect(() => {
    setCurrentIndex(0); // Reset index when filteredProperties change
    setDirection(0); // Reset direction
  }, [filteredProperties.length, activeCategory]); // Depend on activeCategory as well

  const nextProperty = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredProperties.length);
  };

  const prevProperty = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredProperties.length) % filteredProperties.length);
  };

  const carouselItemVariants = {
    hidden: (direction) => ({
      opacity: 0,
      x: direction > 0 ? "100%" : "-100%",
    }),
    visible: {
      opacity: 1,
      x: "0%",
      transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.4 },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction < 0 ? "100%" : "-100%",
      transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.4 },
    }),
  };
  
  const viewAllProperties = () => {
    navigate('/properties');
  };

  if (loading) {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mx-auto mb-16"></div>
            
            <div className="h-10 bg-gray-100 rounded-lg w-full max-w-md mx-auto mb-8 flex justify-center gap-4">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-8 bg-gray-200 rounded-full w-24"></div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl shadow h-96">
                  <div className="h-64 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">
            {sectionTitle} 
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            {sectionSubtitle}
          </p>
          <p className="text-red-500">Error: {error}. Displaying sample properties.</p>
          {/* Render sample properties if error occurs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mt-8">
            {sampleProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, x: "100%" }} // Start off-screen to the right and invisible
      animate={{ opacity: 1, x: 0 }}      // Animate to fully visible and at its normal position
      transition={{ duration: 0.8, ease: "easeInOut" }} // Animation duration and easing
      className="py-16 bg-white"
    > 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Updated header structure */}
        <div className="mb-10 text-center md:text-left">
          <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-1">
            {sectionSubtitle} {/* Using sectionSubtitle prop here */}
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {sectionTitle} 
              </h2>
              {/* Decorative Line */}
              <div className="mt-3 w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto md:ml-0"></div>
            </div>
            {showViewAllButton && (
              <button 
                onClick={viewAllProperties}
                className="bg-black text-white text-sm font-medium py-2.5 px-6 rounded-full hover:bg-gray-800 transition-colors duration-300 flex items-center shadow-md shrink-0 ml-4"
              >
                All properties
              </button>
            )}
          </div>
        </div>

        {/* Properties Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory} // Ensures re-render on category change for animation
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8" // Adjusted gap
          >
            {filteredProperties.slice(0, 3).map((property) => ( // Display only 3 properties
              <PropertyCard key={property._id} property={property} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls - Removed as not in the target image (static grid of 3) */}
      </div>
    </motion.section>
  );
};

PropertiesShow.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showViewAllButton: PropTypes.bool,
};

export default PropertiesShow;