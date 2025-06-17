import React from 'react';
import { logos } from '../assets/logo';
import { motion } from 'framer-motion';

const Companies = () => {
  const allLogos = [
    logos.Googlelogo,
    logos.Bookinglogo,
    logos.Airbnblogo,
    logos.Microsoftlogo,
    logos.Amazonlogo,
  ];

  // Duplicate logos for a seamless loop
  const duplicatedLogos = [...allLogos, ...allLogos];

  const marqueeVariants = {
    animate: {
      x: [0, -100 * allLogos.length], // Adjust -100 based on logo width and gap
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20, // Adjust duration for speed
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="mt-16 my-3 mx-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-white rounded-lg shadow-xl py-12" // Changed pb-12 to py-12 for consistent padding
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold text-gray-900 mb-10">Trusted by 200+ companies</h2>
          {/* Logo Marquee */}
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              variants={marqueeVariants}
              animate="animate"
            >
              {duplicatedLogos.map((logoUrl, index) => (
                <div key={index} className="flex-shrink-0 mx-4" style={{ minWidth: '160px' }}> {/* Adjust minWidth and mx-4 as needed */}
                  <img 
                    className="max-h-12 w-auto object-contain" 
                    src={logoUrl} 
                    alt={`Company Logo ${index + 1}`} 
                    // width="158" // Can be omitted if using w-auto and max-h for responsive sizing
                    // height="48"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Companies;
