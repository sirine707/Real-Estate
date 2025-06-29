import React from "react";
import { motion } from "framer-motion";
import ContactHero from "../components/contact/ContactHero";

const Contact = () => {
  return (
    <main
      style={{
        transform: "scale(0.76)",
        transformOrigin: "top left",
        width: "131.58%",
        height: "131.58%",
        minHeight: "131.58vh",
        overflow: "visible",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-16 pb-16 md:pb-0"
      >
        <ContactHero />
      </motion.div>
    </main>
  );
};

export default Contact;
