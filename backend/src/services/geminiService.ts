import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

// Gemini response interface
export interface GeminiResponse {
  category: "Bug" | "Feature Request" | "Improvement" | "Other";
  sentiment: "Positive" | "Neutral" | "Negative";
  priority_score: number;
  summary: string;
  tags: string[];
}

// Initialize SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Analyze feedback using Gemini AI
 */
export const analyzeFeedback = async (
  title: string,
  description: string
): Promise<GeminiResponse> => {
  const prompt = `
Analyze this product feedback and return ONLY JSON (no markdown, no backticks, no explanation):

{
  "category": "Bug | Feature Request | Improvement | Other",
  "sentiment": "Positive | Negative | Neutral",
  "priority_score": number between 1 and 10,
  "summary": "one short sentence summary",
  "tags": ["tag1", "tag2"]
}

Title: ${title}
Description: ${description}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,  // ✅ pass string directly, not array
    });

    // ✅ correct way to get text from SDK response
    const text = response.text ?? "";

    // Clean code fences if any
    const cleaned = text.replace(/```json|```/g, "").trim();

    const parsed: GeminiResponse = JSON.parse(cleaned);
    return parsed;

  } catch (error: any) {
    if (error?.status === 429) {
      console.error("Gemini rate limit hit - using fallback");
    } else {
      console.error("Gemini API Error:", error.message || error);
    }

    // Fallback so feedback always saves to MongoDB
    return {
      category: "Other",
      sentiment: "Neutral",
      priority_score: 5,
      summary: "AI analysis failed",
      tags: [],
    };
  }
};