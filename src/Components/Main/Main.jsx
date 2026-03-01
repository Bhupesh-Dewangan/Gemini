import React, { useContext, useRef, useEffect } from "react";
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
      <div className="nav flex items-center justify-between p-5 text-2xl text-[#585858] shrink-0">
        <p>Gemini</p>
        <img
          src={assets.user_icon}
          alt="user icon"
          className="w-10 rounded-[50%]"
        />
      </div>

      <div className="main-content flex-1 overflow-y-auto w-[80%] mx-auto">
        {!showResults ? (
          // Greeting section - only show when no messages
          <>
            <div className="greet my-12.5 text-[#c4c7c5] font-bold p-5">
              <h1 className="theme-text text-5xl">
                Welcome to Gemini....
              </h1>
              <p className="text-4xl">How can I assist you today?</p>
            </div>
            <div className="cards grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 p-5">
              <div
                className="card h-50 p-5 bg-[#f0f4f9] hover:bg-[#dfe4ea] rounded-xl relative cursor-pointer"
                onClick={() =>
                  handleSuggestionClick(
                    "Suggest beautiful places to see on the upcoming road trip",
                  )
                }
              >
                <p className="text-lg text-[#585858]">
                  Suggest beautiful places to see on the upcoming road trip
                </p>
                <img src={assets.compass_icon} alt="compass icon" />
              </div>
              <div
                className="card h-50 p-5 bg-[#f0f4f9] hover:bg-[#dfe4ea] rounded-xl relative cursor-pointer"
                onClick={() =>
                  handleSuggestionClick(
                    "Briefly summarize this concept: urban planning",
                  )
                }
              >
                <p className="text-lg text-[#585858]">
                  Briefly summarize this concept: urban planning
                </p>
                <img src={assets.bulb_icon} alt="bulb icon" />
              </div>
              <div
                className="card h-50 p-5 bg-[#f0f4f9] hover:bg-[#dfe4ea] rounded-xl relative cursor-pointer"
                onClick={() =>
                  handleSuggestionClick(
                    "Brainstorm team bonding activities for our work retreat",
                  )
                }
              >
                <p className="text-lg text-[#585858]">
                  Brainstorm team bonding activities for our work retreat
                </p>
                <img src={assets.message_icon} alt="message icon" />
              </div>
              <div
                className="card h-50 p-5 bg-[#f0f4f9] hover:bg-[#dfe4ea] rounded-xl relative cursor-pointer"
                onClick={() =>
                  handleSuggestionClick(
                    "Improve the readability of the following code",
                  )
                }
              >
                <p className="text-lg text-[#585858]">
                  Improve the readability of the following code
                </p>
                <img src={assets.code_icon} alt="code icon" />
              </div>
            </div>
          </>
        ) : (
          // Chat messages display
          <div className="chat-messages p-5">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message mb-6 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[70%] p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-[#4285F4] text-white"
                      : "bg-[#f0f4f9] text-[#585858]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message text-left mb-6">
                <div className="inline-block max-w-[70%] p-4 rounded-2xl bg-[#f0f4f9]">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-[#585858] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-[#585858] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-[#585858] rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="main-bottom shrink-0 w-[80%] py-4 mx-auto">
        <div className="search-box flex justify-between bg-[#f0f4f9] gap-5 px-2.5 py-2 rounded-[50px]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Gemini"
            className="flex-1 bg-transparent border-0 outline-0 px-4 text-xl"
            disabled={loading}
          />
          <div className="icons flex items-center gap-3 p-2">
            <img
              src={assets.gallery_icon}
              alt="gallery icon"
              className="cursor-pointer"
            />
            <img
              src={assets.mic_icon}
              alt="mic icon"
              className="cursor-pointer"
            />
            <img
              src={assets.send_icon}
              alt="send icon"
              onClick={handleSend}
              className={`${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            />
          </div>
        </div>

        <p className="bottom-info text-center text-sm text-gray-500 mt-2">
          Gemini is AI and can make mistakes. Please verify critical information
          and provide feedback to help us improve.
        </p>
      </div>
    </div>
  );
}

export default Main;
