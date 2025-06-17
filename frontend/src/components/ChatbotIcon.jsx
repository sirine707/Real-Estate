import React from 'react';

const ChatbotIcon = ({ onClick }) => {
  const iconImageUrl = "https://png.pngtree.com/png-clipart/20240515/original/pngtree-virtual-assistant-in-flat-style-png-image_15101146.png";

  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 z-50 animate-float flex items-center justify-center"
      aria-label="Open chat"
      style={{ width: '80px', height: '80px' }} // Increased size from 72px to 80px
    >
      <img 
        src={iconImageUrl} 
        alt="Chat Assistant" 
        style={{ width: '100%', height: '100%', borderRadius: '50%' }} // Make image fill the button and be circular
      />
    </button>
  );
};

export default ChatbotIcon;
