
import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackData } from '../types';

const MODEL_NAME = 'gemini-3-flash-preview';

export async function generateFeedback(
  transcription: string, 
  scenarioPrompt: string, 
  originalTitle: string
): Promise<FeedbackData> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `
      User just practiced their speaking skills for the scenario: "${originalTitle}".
      Transcription: "${transcription}"
      Evaluation criteria: ${scenarioPrompt}

      Analyze the transcription and provide constructive feedback in the requested JSON format.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "A score out of 100" },
          clarity: { type: Type.STRING, description: "Feedback on clarity and articulation" },
          logic: { type: Type.STRING, description: "Feedback on the logical flow" },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of concrete improvement suggestions"
          },
          improvedVersion: { type: Type.STRING, description: "A professional rewrite of the user's speech" }
        },
        required: ["score", "clarity", "logic", "suggestions", "improvedVersion"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Feedback generation failed");
  }
}
