import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from './contactForm'; // Import the ContactForm component

export default function Hero() {
  return (
    <div className="relative min-h-[85vh] md:h-[90vh] flex flex-col items-center justify-center my-6 mx-4 sm:mx-6 rounded-2xl overflow-hidden bg-cover bg-center py-12 sm:py-16 px-4" style={{ backgroundImage: "url('https://framerusercontent.com/images/tfw4YnNJDBQRyFWeXHdwIx9GfDc.jpg?scale-down-to-2048')" }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      {/* Content Grid: Text on Left, Form on Right for larger screens */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center max-w-6xl w-full">
        {/* Text Content Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center md:text-left text-white"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Get in Touch With Us
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed font-light mb-8">
            Have questions about our properties? Need assistance with finding your perfect home?
            Our team is here to help you every step of the way.
          </p>
          
          {/* Decorative line (optional, might be better under text only) */}
          <motion.div 
            className="w-24 h-1 bg-white mx-auto md:mx-0 mt-8"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
        </motion.div>

        {/* Contact Form Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full max-w-md md:max-w-none mx-auto md:mx-0"
        >
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
}