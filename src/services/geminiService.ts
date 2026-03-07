import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please ensure it is set in the environment.');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function generateAppCode(prompt: string, vibe: string) {
  const aiClient = getAI();
  const response = await aiClient.models.generateContent({
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
