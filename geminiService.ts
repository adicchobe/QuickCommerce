
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSupplyForecast = async (inventoryData: any, currentOrders: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Supply Chain Optimization AI for a 10-minute delivery unicorn. 
      Analyze this Dark Store state: 
      Inventory: ${JSON.stringify(inventoryData)}
      Active Orders: ${JSON.stringify(currentOrders)}
      
      Provide a strategic restock recommendation. Identify which items are at risk of stockout in the next 2 hours based on velocity.
      Return a JSON object with: 
      - atRiskItems: string[]
      - recommendedAction: string
      - urgencyLevel: 'high' | 'medium' | 'low'`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atRiskItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedAction: { type: Type.STRING },
            urgencyLevel: { type: Type.STRING }
          },
          required: ["atRiskItems", "recommendedAction", "urgencyLevel"]
        }
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Forecasting Error:", error);
    return null;
  }
};

export const getRecipeAssistant = async (dish: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest a quick 10-minute recipe for "${dish}" and list the exact items needed from a grocery store.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipeName: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedSearchTerms: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["recipeName", "steps", "ingredients", "suggestedSearchTerms"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Recipe Assistant Error:", error);
    return null;
  }
};
