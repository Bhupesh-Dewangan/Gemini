// gemini.js - Updated with working models
import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log('🔑 API Key loaded:', API_KEY ? '✅ Yes' : '❌ No');

export const generateGeminiResponse = async (prompt) => {
  try {
    // OPTION 1: Use gemini-2.0-flash (newer, faster)
    // OPTION 2: Use gemini-1.5-pro (if you need older version)
    // OPTION 3: Use gemini-2.5-pro-exp (experimental, most capable)
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', {
        status: error.response.status,
        message: error.response.data?.error?.message
      });
    }
    throw error;
  }
};