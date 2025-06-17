import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CollapsibleCard = ({ title, icon: Icon, children, initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-4 sm:p-5 focus:outline-none transition-colors hover:bg-gray-50"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {Icon && (
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mr-3 shadow-sm">
              <Icon className="h-5 w-5 text-white" />
            </div>
          )}
          <h3 className="text-md sm:text-lg font-semibold text-gray-700">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto', marginTop: '0px', marginBottom: '0px' },
              collapsed: { opacity: 0, height: 0, marginTop: '0px', marginBottom: '0px' },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 border-t border-gray-200">
              {children}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

CollapsibleCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  initiallyOpen: PropTypes.bool,
};

export default CollapsibleCard;
