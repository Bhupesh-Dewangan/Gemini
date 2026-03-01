
import { createContext, useState } from "react";
import { generateGeminiResponse } from "../config/gemini";

export const GeminiContext = createContext();

const GeminiProvider = ({ children }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]); // recent messages/prompt
    const [prevPrompts, setPrevPrompts] = useState([]); // all previous prompts for sidebar
    const [showResults, setShowResults] = useState(false); // toggle for showing results in sidebar
    const [loading, setLoading] = useState(false);
    const [resultsData, setResultsData] = useState(""); // store results for sidebar

    const onSent = async (prompt) => {
    if (!prompt?.trim()) return;

    // Add user message
    setResultsData("");
    setLoading(true);
    setShowResults(true);

    const userMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);

    try {
        // Get AI response
        const response = await generateGeminiResponse(prompt);
        
        // Add AI message
        const aiMessage = { role: 'assistant', content: response };
        setMessages(prev => [...prev, aiMessage]);
        setResultsData(response);
        
        // Save to prevPrompts if this is the first message
        if (messages.length === 0) {
            const newPrompt = {
                id: Date.now(),
                title: prompt.substring(0, 30) + '...',
                timestamp: new Date().toISOString(),
                messages: [...messages, userMessage, aiMessage] // Save full conversation
            };
            setPrevPrompts(prev => {
                // Check if already exists
                const exists = prev.some(p => p.title === newPrompt.title);
                if (!exists) {
                    const updated = [newPrompt, ...prev];
                    localStorage.setItem('prevPrompts', JSON.stringify(updated));
                    return updated;
                }
                return prev;
            });
        }
        
        setLoading(false);
        setInput('');
    } catch (error) {
        console.error('Error:', error);
        const errorMessage = { 
            role: 'assistant', 
            content: 'Sorry, I encountered an error. Please try again.' 
        };
        setMessages(prev => [...prev, errorMessage]);
        setLoading(false);
        setInput('');
    }
};

    

    const ContextValue = {
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
    };

    return (
        <GeminiContext.Provider value={ContextValue}>
            {children}
        </GeminiContext.Provider>
    );
};

export default GeminiProvider;