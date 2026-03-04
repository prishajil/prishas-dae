
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askBill(question: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: "You are Bill, a friendly and wise financial literacy AI chatbot for teenagers. Your goal is to help teens understand money concepts like budgeting, saving, investing, and credit in a simple, approachable, and fun way. Use emojis occasionally. Keep responses concise and teen-friendly. Do not use any markdown formatting like double asterisks (**) for bolding; use plain text only.",
        temperature: 0.7,
      },
    });
    
    // Extract text and perform a safety replacement to remove any accidental double asterisks
    const rawText = response.text || "I'm sorry, I'm having a little trouble thinking right now. Ask me again later!";
    return rawText.replaceAll('**', '');
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops! I hit a snag. Let's try that again.";
  }
}
