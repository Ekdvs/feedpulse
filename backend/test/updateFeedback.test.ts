import request from "supertest";
import express from "express";
import Feedback from "../src/models/feedbackModel";
import jwt from "jsonwebtoken";
import feedbackRouter from "../src/routes/feedbackRouter";

jest.mock("../src/models/feedbackModel");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.use("/api/feedback", feedbackRouter);

describe("PATCH /api/feedback/:id", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update feedback status", async () => {

    (jwt.verify as jest.Mock).mockReturnValue({ id: "1", role: "admin" });

    (Feedback.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      _id: "123",
      status: "Resolved",
    });

    const response = await request(app)
      .patch("/api/feedback/507f1f77bcf86cd799439011")
      .set("Authorization", "Bearer token")
      .send({ status: "Resolved" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(Feedback.findByIdAndUpdate).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
      { status: "Resolved" },
      { returnDocument: "after" }
    );
  });
});