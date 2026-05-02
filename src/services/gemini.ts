import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ProductAnalysis {
  condition: "New" | "Good" | "Worn" | "Damaged";
  suggestedPrice: number;
  category: string;
  brand: string;
  reasoning: string;
}

export const analyzeProductImage = async (base64Image: string): Promise<ProductAnalysis> => {
  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Image,
    },
  };

  const prompt = `Analyze this leather product image for sustainability-focused resale. 
  Detect the condition (New, Good, Worn, Damaged), suggest a fair resale price in Indian Rupees (INR), identify the category (bag, jacket, shoes, etc.), and the brand if visible.
  Provide a brief reasoning for the condition and price.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING, enum: ["New", "Good", "Worn", "Damaged"] },
          suggestedPrice: { type: Type.NUMBER },
          category: { type: Type.STRING },
          brand: { type: Type.STRING },
          reasoning: { type: Type.STRING }
        },
        required: ["condition", "suggestedPrice", "category", "brand", "reasoning"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getSustainabilityTips = async (productType: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Give 3 short, actionable tips to maintain a leather ${productType} to extend its lifecycle and reduce waste.`
  });
  return response.text;
};

export const chatbotResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are ReLeather AI, a sustainability-focused assistant. You help users decide if their leather products are worth selling, provide care tips, and explain the benefits of recycling leather."
    },
    history
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
