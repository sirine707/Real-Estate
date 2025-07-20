import React, { useState } from "react";
import {
  Home,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Mail,
  Send,
  MapPin,
  Phone,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  Building,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Backendurl } from "../App";

// Mobile Collapsible Footer Section
const MobileFooterSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-3 lg:border-none lg:py-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left lg:hidden"
      >
        <h3 className="text-sm font-bold tracking-wider text-gray-700 uppercase">
          {title}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-3 lg:mt-0 lg:h-auto lg:opacity-100"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Footer Column Component
const FooterColumn = ({ title, children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {title && (
        <h3 className="hidden lg:block text-sm font-bold tracking-wider text-gray-700 uppercase mb-4">
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
};

// Footer Link Component
const FooterLink = ({ href, children }) => {
  return (
    <a
      href={href}
      className="flex items-center text-base text-gray-600 transition-all duration-200 hover:text-orange-600 hover:translate-x-1 py-1.5 lg:py-0"
    >
      <ChevronRight className="w-3.5 h-3.5 mr-1 text-orange-500 opacity-0 transition-all duration-200 group-hover:opacity-100" />
      {children}
    </a>
  );
};

// Social Links Component
const socialLinks = [
  {
    icon: Twitter,
    href: "#",
    label: "Twitter",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
  },
  {
    icon: Facebook,
    href: "#",
    label: "Facebook",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
  },
  {
    icon: Instagram,
    href: "#",
    label: "Instagram",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
  }, // Changed gradient to solid orange
  {
    icon: Github,
    href: "https://github.com/AAYUSH412/Real-Estate-Website",
    label: "GitHub",
    color: "bg-gray-700",
    hoverColor: "hover:bg-gray-800",
  }, // Keeping GitHub dark for brand consistency, can be changed to orange-700 and orange-800 if preferred
];

const SocialLinks = () => {
  return (
    <div className="flex items-center gap-3 mt-6">
      {socialLinks.map(({ icon: Icon, href, label, color, hoverColor }) => (
        <motion.a
          key={label}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          href={href}
          title={label}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center text-white ${color} ${hoverColor} rounded-full w-9 h-9 shadow-sm transition-all duration-200`}
        >
          <Icon className="w-4 h-4" />
        </motion.a>
      ))}
    </div>
  );
};

// Newsletter Component
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${Backendurl || "http://localhost:4000"}/news/newsdata`,
        { email }
      );
      if (response.status === 200) {
        toast.success("Successfully subscribed to our newsletter!");
        setEmail("");
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold tracking-wider text-gray-700 uppercase mb-4">
        Stay Updated
      </h3>

      <p className="text-gray-600 mb-4 text-sm">
        Subscribe to our newsletter for the latest property listings and real
        estate insights.
      </p>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 pr-4 py-3 w-full text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-all duration-200 disabled:opacity-70 sm:w-auto w-full shadow-md hover:shadow-lg" // Changed gradient to solid orange
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                <span>Subscribe</span>
              </>
            )}
          </motion.button>
        </div>
      </form>

      <p className="mt-3 text-xs text-gray-500">
        By subscribing, you agree to our{" "}
        <a href="#" className="underline hover:text-orange-600">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

// Main Footer Component
const companyLinks = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Aqarat AI", href: "/ai-agent" },
];

const helpLinks = [
  { name: "Customer Support", href: "/" },
  { name: "FAQs", href: "/" },
  { name: "Terms & Conditions", href: "/" },
  { name: "Privacy Policy", href: "/" },
];

const contactInfo = [
  {
    icon: MapPin,
    text: "Sheikh Zayed Road, Dubai, UAE", // Changed from '123 Property Plaza, Silicon Valley, CA 94088'
    href: "https://maps.google.com/?q=Sheikh+Zayed+Road,Dubai,UAE",
  },
  {
    icon: Phone,
    text: "+1 (123) 456-7890",
    href: "tel:+11234567890",
  },
  {
    icon: Mail,
    text: "support@EmiratEstate.com",
    href: "mailto:support@EmiratEstate.com",
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Logo, Socials, Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 mb-12 pb-12 border-b border-gray-200">
          {/* Logo and Description */}
          <FooterColumn className="lg:col-span-1" delay={0.1}>
            <div className="flex items-center space-x-3 mb-4">
              {/* Using Home icon as a placeholder for the logo */}
              <div className="p-2 bg-orange-500 text-white rounded-lg shadow-md">
                {" "}
                {/* Changed gradient to solid orange */}
                <Building className="w-7 h-7" />
              </div>
              <span className="text-2xl font-bold text-orange-600">
                {" "}
                {/* Changed text color to orange */}
                EmiratEstate
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your trusted partner in finding the perfect property. Explore a
              wide range of listings and expert advice.
            </p>
            <SocialLinks />
          </FooterColumn>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <Newsletter />
          </div>
        </div>

        {/* Middle Section: Quick Links, Support, Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-12">
          {/* Quick Links Column */}
          <FooterColumn
            title="Quick Links"
            className="lg:col-span-3"
            delay={0.2}
          >
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name} className="group">
                  <FooterLink href={link.href}>{link.name}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Help Column */}
          <FooterColumn title="Support" className="lg:col-span-3" delay={0.3}>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.name} className="group">
                  <FooterLink href={link.href}>{link.name}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Contact Info */}
          <FooterColumn
            title="Contact Us"
            className="lg:col-span-4"
            delay={0.4}
          >
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-start text-gray-600 hover:text-orange-600 transition-colors duration-200" // Changed hover color
                    target={item.icon === MapPin ? "_blank" : undefined}
                    rel={
                      item.icon === MapPin ? "noopener noreferrer" : undefined
                    }
                  >
                    <item.icon className="w-4 h-4 mt-1 mr-3 flex-shrink-0 text-orange-500" />{" "}
                    {/* Changed icon color */}
                    <span className="text-sm">{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>

        {/* Bottom Section: Copyright and Browse Properties */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0 text-center md:text-left">
            © {new Date().getFullYear()} EmiratEstate. All Rights Reserved.
          </p>

          <motion.a
            href="/properties"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center text-orange-600 hover:text-white hover:bg-orange-500 px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium" // Changed to orange theme
          >
            Browse Our Properties
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
