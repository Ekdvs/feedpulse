import express from "express";
import { submitFeedback } from "../controllers/feedbackController";

const feedbackRouter = express.Router();
feedbackRouter.post('/',submitFeedback);

export default feedbackRouter;