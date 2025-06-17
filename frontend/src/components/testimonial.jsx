import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { Star, ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../assets/testimonialdata';

const TestimonialCard = ({ testimonial, index, activeIndex, direction }) => {
  return (
    <motion.div
      key={testimonial.id}
      initial={{ opacity: 0, x: direction === 'right' ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction === 'right' ? -50 : 50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative"
    >
      {/* Quote icon */}
      <div className="absolute top-4 right-4 opacity-10">
        <Quote className="w-12 h-12 text-orange-500" />
      </div>

      {/* Testimonial content */}
      <p className="text-gray-700 italic mb-6 text-lg leading-relaxed relative z-10">
        "{testimonial.text}"
      </p>

      <div className="mt-8 flex items-center">
        {/* Profile image */}
        <div className="relative">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-orange-100"
            loading="lazy"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-2 -right-2 bg-orange-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md"
          >
            <Quote className="w-3 h-3" />
          </motion.div>
        </div>

        <div className="ml-4">
          {/* Client info */}
          <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
          <p className="text-sm text-gray-600 flex items-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-600 mr-2"></span>
            {testimonial.location}
          </p>
          
          {/* Star rating */}
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Position indicator */}
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {testimonials.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === index ? 'bg-orange-600 w-6 transition-all duration-300' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [autoplay, setAutoplay] = useState(true);
  const desktopCarouselRef = useRef(null); // Ref for desktop carousel

  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setDirection('right');
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  const handlePrev = () => {
    setDirection('left');
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setAutoplay(false);
  };

  const handleNext = () => {
    setDirection('right');
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setAutoplay(false);
  };

  // Duplicate testimonials for seamless scrolling effect on desktop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container for Title and Testimonials */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
          {/* Text Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/3 text-center lg:text-left mb-16 lg:mb-0 lg:sticky lg:top-24"
          >
            <span className="text-orange-600 font-semibold tracking-wider text-sm uppercase">Testimonials</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-4">DISCOVER MORE OF OUR PROPERTIES</h2>
            <div className="w-24 h-1 bg-orange-600 mx-auto lg:mx-0 mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0">
              Checkout our reviews left by our trusty customers for us.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 text-center lg:text-left"
            >
              <a
                href="/contact"
                className="inline-flex items-center bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
              >
                Share Your Experience
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

          {/* Testimonials Section (Desktop and Mobile) */}
          <motion.div 
            initial={{ x: "-20%", opacity: 0 }} // Start from 20% to the left and transparent
            whileInView={{ x: 0, opacity: 1 }} // Animate to original position (x:0) and full opacity
            viewport={{ once: true, amount: 0.1 }} // Trigger animation once when 10% of the section is visible
            transition={{ duration: 0.7, ease: "easeOut" }} // Animation for the whole section
            className="lg:w-2/3 lg:pl-8"
          >
            {/* Desktop Testimonials - Vertical Auto-Scroll */}
            <div className="hidden md:block relative h-[600px] overflow-hidden" ref={desktopCarouselRef}> {/* Container for fixed height and overflow */}
              {/* Blur effect top */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-50 to-transparent z-20 pointer-events-none"></div>
              
              <motion.div
                className="space-y-8" // Keeps the vertical stacking
                animate={{ y: [0, - (testimonials.length * 250)] }} // Approximate height of each card + margin
                transition={{
                  duration: testimonials.length * 5, // Adjust speed based on number of items
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                {duplicatedTestimonials.map((testimonial, index) => ( // Use duplicated array
                  <motion.div
                    key={`${testimonial.id}-${index}`} // Ensure unique keys for duplicated items
                    // Removed individual whileInView/initial/transition for slide-in, parent now handles this
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative"
                    style={{ height: '230px' }} // Give cards a fixed height for consistent scrolling
                  >
                    <div className="absolute top-4 right-4 opacity-10">
                      <Quote className="w-12 h-12 text-orange-500" />
                    </div>

                    <p className="text-gray-700 italic mb-6 text-lg leading-relaxed relative z-10 line-clamp-3"> {/* line-clamp to prevent overflow */}
                      "{testimonial.text}"
                    </p>

                    <div className="mt-auto flex items-center pt-4"> {/* Ensure bottom alignment */}
                      <div className="relative">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-orange-100"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-orange-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md">
                          <Quote className="w-3 h-3" />
                        </div>
                      </div>

                      <div className="ml-4">
                        <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-600 mr-2"></span>
                          {testimonial.location}
                        </p>
                        
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              {/* Blur effect bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent z-20 pointer-events-none"></div>
            </div>

            {/* Mobile Testimonial Carousel */}
            <div className="md:hidden relative">
              <div className="overflow-hidden px-4">
                <AnimatePresence mode="wait" initial={false}>
                  <TestimonialCard 
                    testimonial={testimonials[activeIndex]} 
                    index={activeIndex}
                    activeIndex={activeIndex}
                    direction={direction}
                    key={activeIndex}
                  />
                </AnimatePresence>
              </div>

              <div className="flex justify-center mt-10 space-x-4">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-white shadow-md border border-gray-200 text-gray-700 hover:bg-orange-600 hover:text-white transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-white shadow-md border border-gray-200 text-gray-700 hover:bg-orange-600 hover:text-white transition-colors"
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Call to Action for Mobile - Kept for mobile view if text section becomes too long */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} // This can remain for a subtle up-fade for the mobile CTA
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }} // Delay slightly after section slides in
              className="mt-16 text-center md:hidden" // Show only on mobile
            >
              <a
                href="/contact"
                className="inline-flex items-center bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
              >
                Share Your Experience
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;