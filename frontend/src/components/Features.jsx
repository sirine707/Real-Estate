import React from "react";
import { motion } from "framer-motion";
import Agent1 from "../assets/images/agent1.jpg";
import Agent2 from "../assets/images/agent2.jpg";
import Agent3 from "../assets/images/agent3.png";
import Agent4 from "../assets/images/agent4.png";

const agents = [
  { id: 1, name: "Ahmed", image: Agent1, title: "Senior Consultant" },
  { id: 2, name: "Tiffany", image: Agent2, title: "Property Specialist" },
  { id: 3, name: "Lorren", image: Agent3, title: "Client Advisor" },
  { id: 6, name: "Rebecca", image: Agent4, title: "Agent" },
];

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Updated to match other sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* Subtitle */}
          <div className="text-sm font-semibold text-orange-600 uppercase tracking-wider">
            Personalized Guidance
          </div>
          {/* Main Title: "Proven Expertise" */}
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-800">
            Proven Expertise
          </h2>
          {/* Decorative Line */}
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto"></div>
        </motion.div>

        {/* Agent Display Section - Changed from Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} // Adjusted initial animation slightly
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-12 w-full max-w-6xl mx-auto" // Removed flex flex-col items-center
        >
          {/* Grid layout for agents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {agents.map((agent, index) => (
              // Card: Adjusted for grid layout, set a fixed height, added flip animation
              <motion.div
                key={agent.id}
                className="h-[450px] rounded-xl shadow-lg overflow-hidden group relative"
                style={{ perspective: '1000px' }} // For 3D effect
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }} // Trigger once, when 30% is visible
                variants={{
                  hidden: { rotateY: 180, opacity: 0, scale: 0.9 },
                  visible: {
                    rotateY: 0,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: "easeOut",
                      delay: index * 0.15 // Stagger animation
                    }
                  }
                }}
              >
                {/* Image: now fills the card, absolutely positioned */}
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                {/* Scrim: for text readability over the image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none"></div>
                
                {/* Content: overlaid at the bottom, text white/light gray for contrast */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left z-10"> 
                  <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3> 
                  <p className="text-sm text-gray-200">{agent.title}</p> 
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Removed Navigation Buttons and Dots Indicator */}
      </div>
    </section>
  );
};

export default Features;