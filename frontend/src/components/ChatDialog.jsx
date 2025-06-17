import React, { useState, useRef, useEffect } from "react";
import { FiX } from 'react-icons/fi';

const ChatDialog = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) { 
      setMessages([
        { sender: 'bot', text: 'Hello! I am your EmiratEstate Assistant. How can I help you with UAE properties today?' } 
      ]);
      setInput(""); 
    }
  }, [isOpen]); 

  const getLLMResponse = async (userInput) => {
    const promptTemplate = `System: You are a UAE real estate agent. Answer only about property listings, VAT rules (5% on sales), and RERA guidelines. Keep responses concise and helpful.\n\nUser: ${userInput}\nAssistant: `;

    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",  {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "inputs": promptTemplate,
        "parameters": {
          "max_new_tokens": 200,
          "temperature": 0.7,
          "return_full_text": false
        }
      })
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: "Failed to parse error from API" }));
        console.error('Hugging Face API error:', response.status, errorBody);
        throw new Error(errorBody.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data[0]?.generated_text?.trim() || "I'm still learning! Ask about property types, pricing, or VAT.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    const currentInput = input;
    setInput("");

    try {
      const botReplyText = await getLLMResponse(currentInput);
      setMessages((prev) => [...prev, { text: botReplyText, sender: "bot" }]);
    } catch (error) {
      console.error("Error in handleSend:", error.message);
      setMessages((prev) => [...prev, { text: `Error: ${error.message || "Could not reach the server."}`, sender: "bot" }]);
    }

    setLoading(false);
  };

  if (!isOpen) return null; 

  const userIconUrl = "https://as2.ftcdn.net/jpg/03/97/66/25/1000_F_397662538_1JZpx5wY6fOOedl4Pzk0qKGMe9VdnFvf.jpg";
  const botIconUrl = "https://previews.123rf.com/images/olegdudko/olegdudko1507/olegdudko150713895/42646039-service-customer-service-representative-women.jpg";

  return (
    <div className="fixed bottom-20 right-5 sm:right-10 bg-white shadow-2xl rounded-lg w-96 sm:w-[440px] h-[500px] flex flex-col z-50 border border-gray-300 chat-container">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg chat-header">
        <h3 className="text-lg font-semibold">EmiratEstate Assistant</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <FiX size={24} />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 chat-window"> 
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end space-x-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <img 
                src={botIconUrl} 
                alt="Bot" 
                className="w-12 h-12 rounded-full mb-1 object-cover" // Increased size from w-10 h-10
              />
            )}
            <div
              className={`max-w-[70%] p-3 rounded-xl shadow ${
                msg.sender === 'user'
                  ? 'bg-orange-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              } message ${msg.sender}`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
            {msg.sender === 'user' && (
              <img 
                src={userIconUrl} 
                alt="User" 
                className="w-12 h-12 rounded-full mb-1 object-cover" // Increased size from w-10 h-10
              />
            )}
          </div>
        ))}
        {loading && (
            <div className="flex items-end space-x-2 justify-start">
                 <img 
                   src={botIconUrl} 
                   alt="Bot typing" 
                   className="w-12 h-12 rounded-full mb-1 object-cover" // Increased size from w-10 h-10
                 />
                 <div className="max-w-[70%] p-3 rounded-xl shadow bg-gray-200 text-gray-800 rounded-bl-none message bot">
                    <p className="text-sm">...</p>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-gray-200 bg-white chat-input">
        <div className="flex items-center space-x-2">
          <input
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about UAE real estate..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button 
            onClick={handleSend} 
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDialog;
