import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAppCode(prompt: string, vibe: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Create a simple React application based on this prompt: "${prompt}". The vibe should be "${vibe}". 
    Return the result as a JSON object with the following structure:
    {
      "code": "The full React code for App.tsx",
      "components": ["List of component names"],
      "description": "Brief description of the app"
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          code: { type: Type.STRING },
          components: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING }
        },
        required: ["code", "components", "description"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
