
import { GoogleGenAI, Type } from "@google/genai";
import { SynopsisRequest, SynopsisResponse } from "../types";

export const generateVideoSynopsis = async (req: SynopsisRequest): Promise<SynopsisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Act as a creative director for a top-tier film production house. Generate a cinematic video project synopsis for the brand "${req.brandName}" with a "${req.mood}" mood. 
    The synopsis should be visionary, sophisticated, and slightly futuristic.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          concept: { type: Type.STRING },
          synopsis: { type: Type.STRING },
          visualHook: { type: Type.STRING },
        },
        required: ["title", "concept", "synopsis", "visualHook"],
      },
    },
  });

  return JSON.parse(response.text);
};
