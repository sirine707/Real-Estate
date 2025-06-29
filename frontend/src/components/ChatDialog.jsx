import React, { useState, useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        {
          sender: "bot",
          text: "Hello! I am your EmiratEstate Assistant. How can I help you with UAE properties today?",
        },
      ]);
      setInput("");
    }
  }, [isOpen]);

  const getLLMResponse = async (userInput) => {
    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
    const response = await fetch(`${apiBaseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({
        error: { message: "Failed to parse error from API" },
      }));
      console.error("API error:", response.status, errorBody);
      throw new Error(
        errorBody.error?.message ||
          `API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    console.log("API Response:", data); // For debugging
    return (
      data.reply ||
      "I'm still learning! Ask about property types, pricing, or VAT."
    );
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
      setMessages((prev) => [
        ...prev,
        {
          text: `Error: ${error.message || "Could not reach the server."}`,
          sender: "bot",
        },
      ]);
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  const userIconUrl =
    "https://as2.ftcdn.net/jpg/03/97/66/25/1000_F_397662538_1JZpx5wY6fOOedl4Pzk0qKGMe9VdnFvf.jpg";
  const botIconUrl =
    "https://previews.123rf.com/images/olegdudko/olegdudko1507/olegdudko150713895/42646039-service-customer-service-representative-women.jpg";

  return (
    <div className="fixed bottom-20 right-5 sm:right-10 bg-white shadow-2xl rounded-lg w-80 sm:w-96 h-[450px] flex flex-col z-50 border border-gray-300 chat-container">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg chat-header">
        <h3 className="text-lg font-semibold">EmiratEstate Assistant</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <FiX size={24} />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end space-x-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <img
                src={botIconUrl}
                alt="Bot"
                className="w-12 h-12 rounded-full mb-1 object-cover" // Increased size from w-10 h-10
              />
            )}
            <div
              className={`max-w-[70%] p-3 rounded-xl shadow ${
                msg.sender === "user"
                  ? "bg-orange-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              } message ${msg.sender}`}
            >
              {msg.sender === "bot" ? (
                <div className="text-sm prose prose-sm max-w-full">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="mb-0" {...props} />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{msg.text}</p>
              )}
            </div>
            {msg.sender === "user" && (
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
