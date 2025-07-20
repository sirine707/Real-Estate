import React from "react";
import { motion } from "framer-motion";
import { Star, Phone, Mail, MapPin } from "lucide-react";
import Agent1 from "../assets/images/agent1.jpg";
import Agent2 from "../assets/images/agent2.jpg";
import Agent3 from "../assets/images/agent3.png";
import Agent4 from "../assets/images/agent4.png";

const agents = [
  {
    id: 1,
    name: "Ahmed Al-Mansouri",
    image: Agent1,
    title: "Senior Property Consultant",
    experience: "8+ Years",
    rating: 4.9,
    reviews: 127,
    specialty: "Luxury Properties",
    location: "Dubai Marina",
  },
  {
    id: 2,
    name: "Tiffany Chen",
    image: Agent2,
    title: "Investment Specialist",
    experience: "6+ Years",
    rating: 4.8,
    reviews: 95,
    specialty: "Commercial Real Estate",
    location: "Business Bay",
  },
  {
    id: 3,
    name: "Lorren Williams",
    image: Agent3,
    title: "Client Relations Manager",
    experience: "5+ Years",
    rating: 4.9,
    reviews: 83,
    specialty: "First-time Buyers",
    location: "Downtown Dubai",
  },
  {
    id: 4,
    name: "Rebecca Thompson",
    image: Agent4,
    title: "Property Advisor",
    experience: "4+ Years",
    rating: 4.7,
    reviews: 72,
    specialty: "Residential Sales",
    location: "Jumeirah",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Modern design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full text-orange-600 font-semibold text-sm uppercase tracking-wider shadow-lg mb-6"
          >
            ✨ Meet Our Experts
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent mb-4">
            Your Trusted Property
            <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Advisors
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Meet our team of certified real estate professionals dedicated to
            making your property dreams a reality
          </p>

          {/* Decorative line with animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"
          />
        </motion.div>

        {/* Agent Cards Grid - Modern glassmorphism design */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8"
        >
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -10,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
              className="group relative"
            >
              {/* Main card with glassmorphism effect */}
              <div className="relative h-[520px] bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                {/* Agent image with overlay */}
                <div className="relative h-[280px] overflow-hidden rounded-t-3xl">
                  <motion.img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  {/* Rating badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                    className="absolute top-4 right-4 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg"
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-800">
                      {agent.rating}
                    </span>
                  </motion.div>

                  {/* Experience badge */}
                  <motion.div
                    initial={{ scale: 0, x: -50 }}
                    whileInView={{ scale: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.7, duration: 0.5 }}
                    className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg"
                  >
                    {agent.experience}
                  </motion.div>
                </div>

                {/* Card content */}
                <div className="p-6 space-y-3 h-[240px] flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Name and title */}
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                        {agent.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-600">
                        {agent.title}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <span className="font-medium">{agent.reviews}</span>
                        <span>reviews</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs">{agent.location}</span>
                      </div>
                    </div>

                    {/* Specialty */}
                    <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      {agent.specialty}
                    </div>
                  </div>

                  {/* Contact buttons - Always at bottom */}
                  <div className="flex space-x-2 mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-300"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-white hover:shadow-lg transition-all duration-300"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </motion.button>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 transition-all duration-500 rounded-3xl"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Find Your Dream Property?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our expert team is here to guide you through every step of your
              real estate journey
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
