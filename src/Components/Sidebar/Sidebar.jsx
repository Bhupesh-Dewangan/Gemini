// import React from 'react'
// import {assets} from '../../assets/assets'
// import { useState } from 'react'

// function Sidebar() {

//     const [isOpen, setIsOpen] = useState(true);

//   return (
//     <div className={`sidebar min-h-screen inline-flex flex-col justify-between bg-[#f0f4f9] px-4 py-3 ${isOpen ? 'w-[20%]' : 'w-[7%]'}`}>
//         <div className="top">
//             <img src={assets.menu_icon} alt="menu icon" className='block m-2.5 cursor-pointer' onClick={() => setIsOpen(!isOpen)}/>
//             <div className={`new-chat mt-12.5 inline-flex items-center gap-2.5  px-2.5 py-1.25 bg-[#e6eaf1] rounded-[50px] text-[14px] text-[#838383] cursor-pointer w-[90%] ${isOpen ? 'justify-start' : 'justify-center'}`} >
//                 <img src={assets.plus_icon} alt="plus icon" className='plus'/>
//                 {isOpen ? <span>New Chat</span> : null}
//             </div>
//             {isOpen ?
//             <div className="recent-chats flex flex-col">
//                 <p className="recent-title mt-7.5 mb-2 text-[16px] text-[#000000]">{isOpen ? <span>Recent Chats</span> : null}</p>
//                 <div className="recent-entry flex items-center gap-2.5 p-2 pr-10 rounded-[50px] text-[14px] text-[#282828] cursor-pointer w-[90%] hover:bg-[#e2e6eb]">
//                     <img src={assets.message_icon} alt="message icon" />
//                     <p className='truncate'>Here is Your First Chat</p>
//                 </div>

//             </div>
//              : null}
//         </div>

//         <div className="bottom flex flex-col  ">
//             <div className="bottom-items recent-entry flex items-center gap-2.5 p-2  rounded-[50px] text-[14px] text-[#282828] w-[90%] hover:bg-[#e2e6eb]
//              cursor-pointer">
//                 <img src={assets.question_icon} alt=" question icon" />
//                 {isOpen ? <p>Help</p> : null}
//             </div>

//             <div className="bottom-items recent-entry flex items-center gap-2.5 p-2 pr-10 rounded-[50px] text-[14px] text-[#282828] cursor-pointer w-[90%] hover:bg-[#e2e6eb]">
//                 <img src={assets.history_icon} alt=" history icon" />
//                 {isOpen ? <p>Activity</p> : null}
//             </div>

//             <div className="bottom-items recent-entry flex items-center gap-2.5 p-2 pr-10 rounded-[50px] text-[14px] text-[#282828] cursor-pointer w-[90%] hover:bg-[#e2e6eb]">
//                 <img src={assets.setting_icon} alt=" setting icon" />
//                 {isOpen ? <p>Settings</p> : null}
//             </div>

//         </div>

//     </div>
//   )
// }

// export default Sidebar

import React, { useState, useContext, useEffect } from "react";
import { assets } from "../../assets/assets";
import { GeminiContext } from "../../Context/Context";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const {
    messages,
    prevPrompts,
    setPrevPrompts,
    setMessages,
    setShowResults,
    setResultsData,
  } = useContext(GeminiContext);

  // Load saved prompts from localStorage on mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem("prevPrompts");
    if (savedPrompts) {
      setPrevPrompts(JSON.parse(savedPrompts));
    }
  }, []);

  // Save prompts to localStorage whenever they change
  useEffect(() => {
    if (prevPrompts.length > 0) {
      localStorage.setItem("prevPrompts", JSON.stringify(prevPrompts));
    }
  }, [prevPrompts]);

  const handleNewChat = () => {
    // Save current conversation title if there are messages
    if (messages.length > 0 && messages[0]?.content) {
      const newPrompt = {
        id: Date.now(),
        title: messages[0].content.substring(0, 30) + "...",
        timestamp: new Date().toISOString(),
        messages: messages, // Store full conversation
      };

      // Check if this prompt already exists
      const exists = prevPrompts.some((p) => p.title === newPrompt.title);
      if (!exists) {
        setPrevPrompts((prev) => [newPrompt, ...prev]);
      }
    }

    // Clear current chat
    setMessages([]);
    setShowResults(false);
    setResultsData("");
  };

  const loadChat = (promptData) => {
    // Load selected chat
    if (promptData.messages) {
      setMessages(promptData.messages);
    } else {
      // Fallback for older format
      setMessages([{ role: "user", content: promptData.title }]);
    }
    setShowResults(true);
  };

  const deleteChat = (id, e) => {
    e.stopPropagation(); // Prevent triggering loadChat
    const updatedPrompts = prevPrompts.filter((p) => p.id !== id);
    setPrevPrompts(updatedPrompts);
    localStorage.setItem("prevPrompts", JSON.stringify(updatedPrompts));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`sidebar min-h-screen inline-flex flex-col justify-between bg-[#f0f4f9] px-4 py-3 transition-all duration-300 ${isOpen ? "w-[20%]" : "w-[7%]"}`}
    >
      <div className="top">
        <img
          src={assets.menu_icon}
          alt="menu icon"
          className="block m-2.5 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        <div
          className={`new-chat mt-12.5 inline-flex items-center gap-2.5 px-2.5 py-1.25 bg-[#e6eaf1] rounded-[50px] text-[14px] text-[#838383] cursor-pointer w-[90%] hover:bg-[#dfe4ea] transition-colors ${isOpen ? "justify-start" : "justify-center"}`}
          onClick={handleNewChat}
        >
          <img src={assets.plus_icon} alt="plus icon" className="plus" />
          {isOpen ? <span>New Chat</span> : null}
        </div>

        {isOpen && (
          <div className="recent-chats flex flex-col mt-5">
            <p className="recent-title mb-2 text-[16px] text-[#000000] font-medium">
              Recent Chats
            </p>

            <div className="space-y-2 max-h-100 overflow-y-auto">
              {prevPrompts.length > 0 ? (
                prevPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="group relative flex items-center gap-2.5 p-2 pr-10 rounded-lg text-[14px] text-[#282828] cursor-pointer w-full hover:bg-[#e2e6eb] transition-colors"
                    onClick={() => loadChat(prompt)}
                  >
                    <img
                      src={assets.message_icon}
                      alt="message icon"
                      className="w-4 h-4"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium w-full">{prompt.title}</p>
                      <p className="text-xs text-[#838383]">
                        {formatTimestamp(prompt.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteChat(prompt.id, e)}
                      className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-[#838383] text-sm px-2">
                  No chats yet. Start a conversation!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bottom flex flex-col gap-2">
        <div className="bottom-items recent-entry flex items-center gap-2.5 p-2 rounded-[50px] text-[14px] text-[#282828] w-[90%] hover:bg-[#e2e6eb] cursor-pointer transition-colors">
          <img
            src={assets.question_icon}
            alt="question icon"
            className="w-5 h-5"
          />
          {isOpen ? <p>Help</p> : null}
        </div>

        <div className="bottom-items recent-entry flex items-center gap-2.5 p-2 rounded-[50px] text-[14px] text-[#282828] w-[90%] hover:bg-[#e2e6eb] cursor-pointer transition-colors">
          <img
            src={assets.history_icon}
            alt="history icon"
            className="w-5 h-5"
          />
          {isOpen ? <p>Activity</p> : null}
        </div>

        <div className="bottom-items recent-entry flex items-center gap-2.5 p-2 rounded-[50px] text-[14px] text-[#282828] w-[90%] hover:bg-[#e2e6eb] cursor-pointer transition-colors">
          <img
            src={assets.setting_icon}
            alt="setting icon"
            className="w-5 h-5"
          />
          {isOpen ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
