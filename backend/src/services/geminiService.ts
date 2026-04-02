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
// Weekly AI response interface
export interface WeeklyTheme {
  title: string;
  description: string;
}

export interface WeeklyAIResponse {
  themes: WeeklyTheme[];
  overall_sentiment: string;
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

export const generateWeeklyThemes = async (
  feedbacks: { title: string; description: string }[]
): Promise<WeeklyAIResponse> => {

  // ⚠️ limit input (VERY IMPORTANT)
  const limitedFeedbacks = feedbacks.slice(0, 50);

  const prompt = `
Analyze the following product feedbacks from the last 7 days.

Return ONLY JSON:

{
  "themes": [
    { "title": "Theme name", "description": "Short explanation" }
  ],
  "overall_sentiment": "Short sentence"
}

Rules:
- Give EXACTLY 3 themes
- Keep descriptions short
- Focus on patterns, not individual feedback

Feedbacks:
${limitedFeedbacks.map(f => `- ${f.title}: ${f.description}`).join("\n")}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "";
    const cleaned = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);

  } catch (error: any) {
    console.error("Weekly AI Error:", error.message || error);

    return {
      themes: [],
      overall_sentiment: "Unavailable",
    };
  }
};