import axios from "axios";

//create gemini response interface
interface GeminiResponse {
  category: string;
  sentiment: "positive" | "neutral" | "negative";
  priority_score: number;
  summary: string;
  tags: string[];
}

export const analyzeFeedback = async (
  title: string,
  description: string
): Promise<GeminiResponse | null> => {
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `
    Analyze this product feedback and return ONLY valid JSON:

    {
      "category": "Bug | Feature Request | UX | Performance | Other",
      "sentiment": "positive | negative | neutral",
      "priority_score": number (1-10),
      "summary": "short summary",
      "tags": ["tag1", "tag2"]
    }

    Title: ${title}
    Description: ${description}
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean markdown if exists
    const cleaned = text.replace(/```json|```/g, "").trim();

    const parsed: GeminiResponse = JSON.parse(cleaned);

    return parsed;

  } catch (error) {
    console.error("Gemini API Error:", error);

    return {
      category: "Other",
      sentiment: "neutral",
      priority_score: 5,
      summary: "AI analysis failed",
      tags: []
    };
  }
};