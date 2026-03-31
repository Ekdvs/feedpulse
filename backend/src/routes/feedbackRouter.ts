import express from "express";
import { listFeedbacks, submitFeedback } from "../controllers/feedbackController";
import { adminAuth } from "../middleware/admin";

const feedbackRouter = express.Router();
feedbackRouter.post('/',submitFeedback);
feedbackRouter.get('/',adminAuth,listFeedbacks);

export default feedbackRouter;