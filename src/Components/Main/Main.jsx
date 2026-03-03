import React, { useContext, useRef, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { GeminiContext } from "../../Context/Context";

function Main() {
  const {
    messages,
    setMessages,
    loading,
    setLoading,
    input,
    setInput,
    prevPrompts,
    setPrevPrompts,
    showResults,
    setShowResults,
    resultsData,
    setResultsData,
    onSent,
  } = useContext(GeminiContext);
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSent(input);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    onSent(suggestion);
  };

  return (
    <div className="main flex-1 h-screen flex flex-col overflow-hidden">
      <div className="nav flex items-center justify-between p-4 md:p-5 text-xl md:text-2xl text-[#585858] shrink-0">
        <p className="ml-12 md:ml-0">Gemini</p>
        <img
          src={assets.user_icon}
          alt="user icon"
          className="w-8 md:w-10 rounded-[50%]"
        />
      </div>

      <div className="main-content flex-1 overflow-y-auto w-full md:w-[80%] mx-auto px-4 md:px-0">
        {!showResults ? (
          // Greeting section - only show when no messages
          <>
            <div className="greet my-6 md:my-12.5 text-[#c4c7c5] font-bold p-4 md:p-5">
              <h1 className="theme-text text-3xl md:text-5xl">
                Welcome to Gemini....
              </h1>
              <p className="text-xl md:text-4xl mt-2">
                How can I assist you today?
              </p>
            </div>
            <div className="cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 p-4 md:p-5">
              <div
                className="card h-40 md:h-50 p-4 md:p-5 bg-[#f0f4f9] hover:bg-[#dfe4ea] rounded-xl relative cursor-pointer"
                onClick={() =>
                  handleSuggestionClick(
                    "Suggest beautiful places to see on the upcoming road trip",
                  )
                }
              >
                <p className="text-sm md:text-lg text-[#585858] line-clamp-3">
                  Suggest beautiful places to see on the upcoming road trip
                </p>
                <img 
                  src={assets.compass_icon} 
                  alt="compass icon" 
                  className="w-6 md:w-8 absolute bottom-2 right-2 bg-white p-1.5 rounded-full"
                />
              </div>
              <div
                className="card h-40 md:h-50 p-4 md:p-5 bg-[#f0f4f9] hover:bg-[#dfe4ea] rounded-xl relative cursor-pointer"
                onClick={() =>
                  handleSuggestionClick(
                    "Briefly summarize this concept: urban planning",
                  )
                }
              >
                <p className="text-sm md:text-lg text-[#585858] line-clamp-3">
                  Briefly summarize this concept: urban planning
                </p>
                <img 
                  src={assets.bulb_icon} 
                  alt="bulb icon" 
                  className="w-6 md:w-8 absolute bottom-2 right-2 bg-white p-1.5 rounded-full"
                />
              </div>
              <div
                className="card h-40 md:h-50 p-4 md:p-5 bg-[#f0f4f9] hover:bg-[#dfe4ea] rounded-xl relative cursor-pointer"
                onClick={() =>
                  handleSuggestionClick(
                    "Brainstorm team bonding activities for our work retreat",
                  )
                }
              >
                <p className="text-sm md:text-lg text-[#585858] line-clamp-3">
                  Brainstorm team bonding activities for our work retreat
                </p>
                <img 
                  src={assets.message_icon} 
                  alt="message icon" 
                  className="w-6 md:w-8 absolute bottom-2 right-2 bg-white p-1.5 rounded-full"
                />
              </div>
              <div
                className="card h-40 md:h-50 p-4 md:p-5 bg-[#f0f4f9] hover:bg-[#dfe4ea] rounded-xl relative cursor-pointer"
                onClick={() =>
                  handleSuggestionClick(
                    "Improve the readability of the following code",
                  )
                }
              >
                <p className="text-sm md:text-lg text-[#585858] line-clamp-3">
                  Improve the readability of the following code
                </p>
                <img 
                  src={assets.code_icon} 
                  alt="code icon" 
                  className="w-6 md:w-8 absolute bottom-2 right-2 bg-white p-1.5 rounded-full"
                />
              </div>
            </div>
          </>
        ) : (
          // Chat messages display
          <div className="chat-messages p-3 md:p-5">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message mb-4 md:mb-6 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-[#4285F4] text-white"
                      : "bg-[#f0f4f9] text-[#585858]"
                  }`}
                >
                  <p className="text-sm md:text-base whitespace-pre-wrap wrap-break-word">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message text-left mb-4 md:mb-6">
                <div className="inline-block max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl bg-[#f0f4f9]">
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#585858] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#585858] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#585858] rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="main-bottom shrink-0 w-full md:w-[80%] py-3 md:py-4 px-4 md:px-0 mx-auto">
        <div className="search-box flex justify-between items-center bg-[#f0f4f9] gap-2 md:gap-5 px-3 md:px-2.5 py-1.5 md:py-2 rounded-[50px]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Gemini"
            className="flex-1 bg-transparent border-0 outline-0 px-2 md:px-4 text-sm md:text-xl min-w-0"
            disabled={loading}
          />
          <div className="icons flex items-center gap-1.5 md:gap-3">
            <img
              src={assets.gallery_icon}
              alt="gallery icon"
              className="cursor-pointer w-5 h-5 sm:w-2 sm:h-2 md:w-6 md:h-6 lg:w-6 lg:h-6"
            />
            <img
              src={assets.mic_icon}
              alt="mic icon"
              className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 lg:w-6 lg:h-6"
            />
            <img
              src={assets.send_icon}
              alt="send icon"
              onClick={handleSend}
              className={`cursor-pointer w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 lg:w-6 lg:h-6 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
        </div>

        <p className="bottom-info text-center text-[10px] md:text-sm text-gray-500 mt-2 px-2">
          Gemini is AI and can make mistakes. Please verify critical information
          and provide feedback to help us improve.
        </p>
      </div>
    </div>
  );
}

export default Main;