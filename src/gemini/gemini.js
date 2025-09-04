// src/Gemini/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { moodPrompts } from "./moodPrompts.js";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the model instance
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

let chat= null;

// Create a single chat session and pass initial system prompt
export function createChat(mood = "default") {
   chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        {
          text: moodPrompts[mood] || moodPrompts.Default
        },
      ],
    },
  ],
});
return chat;
}

// Send user messages to Gemini
export async function sendChatMessage(userInput) {
  try {
    if (!chat) {
      // If chat wasn't created, use default mood
      chat = createChat("default");
    }

    const result = await chat.sendMessage(userInput);
    return result.response.text();
  } catch (error) {
    console.error("Gemini chat error:", error);
    return "⚠️ I couldn’t process that. Please try again.";
  }
}

