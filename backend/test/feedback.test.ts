// test/feedback.test.ts
import request from "supertest";
import express from "express";
import feedbackRouter from "../src/routes/feedbackRouter";
import Feedback from "../src/models/feedbackModel";
import * as aiService from "../src/services/geminiService"; // For analyzeFeedback mock

jest.mock("../src/models/feedbackModel");
jest.mock("../src/services/geminiService"); // Mock AI service

const app = express();
app.use(express.json());
app.use("/api/feedback", feedbackRouter);

describe("POST /api/feedback", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should reject empty title", async () => {
    const response = await request(app)
      .post("/api/feedback")
      .send({
        title: "",
        description: "This description is valid long enough",
        category: "Bug",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject description with less than 20 characters", async () => {
    const response = await request(app)
      .post("/api/feedback")
      .send({
        title: "Valid title",
        description: "short",
        category: "Bug",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should accept valid feedback and trigger AI", async () => {
    // Mock DB create
    (Feedback.create as jest.Mock).mockResolvedValue({
      _id: "123",
      title: "Valid title",
      description: "This is a valid long description for testing",
      category: "Bug",
    });

    // Mock AI response
    (aiService.analyzeFeedback as jest.Mock).mockResolvedValue({
      category: "Bug",
      sentiment: "Positive",
      priority_score: 8,
      summary: "Summary from AI",
      tags: ["ui", "ux"],
    });

    // Mock DB update
    (Feedback.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      _id: "123",
      title: "Valid title",
      description: "This is a valid long description for testing",
      category: "Bug",
      ai_category: "Bug",
      ai_sentiment: "Positive",
      ai_priority: 8,
      ai_summary: "Summary from AI",
      ai_tags: ["ui", "ux"],
      ai_processed: true,
    });

    const response = await request(app)
      .post("/api/feedback")
      .send({
        title: "Valid title",
        description: "This is a valid long description for testing",
        category: "Bug",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(Feedback.create).toHaveBeenCalledTimes(1);
    expect(aiService.analyzeFeedback).toHaveBeenCalledTimes(1);
    expect(Feedback.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });

});