

// Helper to create a mock AI
const createMockAI = (mockFn: jest.Mock) => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockFn,
    },
  })),
});

describe("Gemini Service - analyzeFeedback", () => {
  afterEach(() => {
    jest.resetModules(); // clear module cache so mocks work per test
    jest.clearAllMocks();
  });

  it("should parse AI response correctly", async () => {
    jest.mock("@google/genai", () => 
      createMockAI(jest.fn().mockResolvedValue({
        text: JSON.stringify({
          category: "Bug",
          sentiment: "Negative",
          priority_score: 7,
          summary: "Test summary",
          tags: ["bug"],
        }),
      }))
    );

    const { analyzeFeedback } = await import("../src/services/geminiService");

    const result = await analyzeFeedback("Bug", "Something wrong happened");
    expect(result.category).toBe("Bug");
    expect(result.sentiment).toBe("Negative");
    expect(result.priority_score).toBe(7);
    expect(result.summary).toBe("Test summary");
    expect(result.tags).toContain("bug");
  });

  it("should fallback if AI throws an error", async () => {
    jest.mock("@google/genai", () =>
      createMockAI(jest.fn().mockRejectedValue(new Error("API failure")))
    );

    const { analyzeFeedback } = await import("../src/services/geminiService");

    const fallbackResult = await analyzeFeedback("Bug", "Error test");
    expect(fallbackResult.category).toBe("Other");
    expect(fallbackResult.sentiment).toBe("Neutral");
    expect(fallbackResult.priority_score).toBe(5);
    expect(fallbackResult.summary).toBe("AI analysis failed");
    expect(fallbackResult.tags).toEqual([]);
  });
});

describe("Gemini Service - generateWeeklyThemes", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("should parse weekly AI response correctly", async () => {
    jest.mock("@google/genai", () =>
      createMockAI(jest.fn().mockResolvedValue({
        text: JSON.stringify({
          themes: [
            { title: "Theme 1", description: "Short description 1" },
            { title: "Theme 2", description: "Short description 2" },
            { title: "Theme 3", description: "Short description 3" },
          ],
          overall_sentiment: "Mostly positive",
        }),
      }))
    );

    const { generateWeeklyThemes } = await import("../src/services/geminiService");

    const feedbacks = [
      { title: "Bug1", description: "Description long enough" },
      { title: "Bug2", description: "Another description" },
    ];

    const result = await generateWeeklyThemes(feedbacks);
    expect(result.themes.length).toBe(3);
    expect(result.overall_sentiment).toBe("Mostly positive");
  });

  it("should fallback if AI throws an error", async () => {
    jest.mock("@google/genai", () =>
      createMockAI(jest.fn().mockRejectedValue(new Error("Weekly AI failure")))
    );

    const { generateWeeklyThemes } = await import("../src/services/geminiService");

    const result = await generateWeeklyThemes([
      { title: "Bug1", description: "Long description for fallback test" },
    ]);

    expect(result.themes).toEqual([]);
    expect(result.overall_sentiment).toBe("Unavailable");
  });
});