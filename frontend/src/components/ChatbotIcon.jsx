import React, { useEffect, useState } from "react";

const ChatbotIcon = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  const iconImageUrl =
    "https://png.pngtree.com/png-clipart/20240515/original/pngtree-virtual-assistant-in-flat-style-png-image_15101146.png";

  // Show the icon immediately when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Very short delay to ensure smooth animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 rounded-full shadow-lg transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 z-50 flex items-center justify-center hover:scale-110 hover:shadow-xl ${
        isVisible
          ? "opacity-100 translate-y-0 animate-float"
          : "opacity-0 translate-y-4"
      }`}
      aria-label="Open chat"
      style={{ width: "60px", height: "60px" }}
    >
      <img
        src={iconImageUrl}
        alt="Chat Assistant"
        className="transition-transform duration-300 hover:rotate-12"
        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
      />

      {/* Pulse animation indicator */}
      <div
        className={`absolute inset-0 rounded-full bg-orange-400 animate-ping ${
          isVisible ? "opacity-20" : "opacity-0"
        }`}
      />
    </button>
  );
};

export default ChatbotIcon;
