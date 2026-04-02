import request from "supertest";
import express from "express";
import feedbackRouter from "../src/routes/feedbackRouter";


const app = express();
app.use(express.json());
app.use("/api/feedback", feedbackRouter);

describe("Protected Routes", () => {
  it("should reject unauthenticated request", async () => {
    const response = await request(app).get("/api/feedback");

    expect(response.status).toBe(401);
  });
});