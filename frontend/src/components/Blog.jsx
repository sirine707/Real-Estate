import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts } from '../assets/blogdata';
import { toast } from 'react-toastify';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { 
    duration: 0.4,
    ease: "easeInOut"
  }
};

// BlogCard component
const BlogCard = ({ post }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: post.link
        });
        toast.success("Post shared successfully!");
      } else {
        await navigator.clipboard.writeText(post.link);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("Unable to share post");
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    
    if (!isBookmarked) {
      toast.success(`Saved "${post.title}" to your reading list`);
    } else {
      toast.info(`Removed "${post.title}" from your reading list`);
    }
  };

  const handleReadMore = () => {
    window.open(post.link, '_blank', 'noopener,noreferrer');
  };

  const estimatedReadTime = Math.ceil(post.excerpt.split(' ').length / 200);
  
  // Extract category from post (or use default)
  const category = post.category || "Real Estate";

  return (
    <motion.div
      className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200" // Adjusted shadow and border
      variants={cardVariants}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} // Simplified hover effect
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleReadMore} // Keep card clickable
    >
      <div className="relative overflow-hidden aspect-w-16 aspect-h-9">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" // Adjusted height and hover scale
        />
        {/* Removed gradient overlay and hover effects on image */}
      </div>

      <div className="p-5"> {/* Adjusted padding */}
        {/* Category Tag - Styled to match image */}
        <div className="mb-3">
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            {category} 
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {post.title}
        </h3>
        
        {/* Removed excerpt, date, read time, share/bookmark buttons, and continue reading link to match the simpler design */}
      </div>
    </motion.div>
  );
};

// Main Blog component
const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Animation for the entire section
  const sectionVariants = {
    hidden: { opacity: 0, x: "-100%" }, // MODIFIED: x: "-100%" to slide from left
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut", 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const categories = ['All', 'Buying', 'Selling', 'Investment', 'Tips'];
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())); // Added check for post.excerpt
    const matchesCategory = selectedCategory === 'All' || (post.category || 'Real Estate') === selectedCategory;
    return matchesSearch && matchesCategory; // Corrected filter logic
  });

  return (
    <motion.section 
      className="py-20 bg-gradient-to-b from-white to-gray-50"
      variants={sectionVariants}
      initial="hidden"
      animate="visible" // CHANGED from whileInView
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* MODIFIED: Main header wrapper - items-center for md screens and up */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center md:items-center mb-12" // Changed md:items-start to md:items-center
        >
          {/* Text block - order 1 on md+ (left side) - RESTRUCTURED */}
          <div className="md:order-1 text-center md:text-left w-full md:w-auto mb-6 md:mb-0">
            {/* Subtitle: "Latest Insights & Trends" */}
            <div className="text-sm font-semibold text-orange-600 uppercase tracking-wider">
              Latest Insights & Trends
            </div>

            {/* Main Title: "Proven Expertise" (styled like "Featured Properties" title) */}
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-800">
              Proven Expertise
            </h2>

            {/* Decorative Line - under "Proven Expertise" */}
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto md:ml-0"></div>
          </div>

          {/* Filter buttons block - order 2 on md+ (right side) */}
          <div className="w-full md:w-auto flex flex-wrap gap-2 justify-center md:justify-end md:order-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>
        
        {filteredPosts.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants} // RE-ENABLED
            initial="hidden" // RE-ENABLED
            whileInView="visible" // RE-ENABLED
            viewport={{ once: true, amount: 0.1 }} // RE-ENABLED and changed margin to amount
          >
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100"
          >
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No articles found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any articles matching your search criteria. 
              Try using different keywords or browse all categories.
            </p>
          </motion.div>
        )}
        
        {/* View all articles button REMOVED */}
      </div>
    </motion.section>
  );
};

export default Blog;