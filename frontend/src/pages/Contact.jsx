import React from 'react'
import { motion } from 'framer-motion';
import ContactHero from '../components/contact/ContactHero';


const Contact = () => {
  return (
    <div>
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16 pb-16 md:pb-0"
    >
      <ContactHero />
    </motion.div>
    </div>
  )
}

export default Contact
