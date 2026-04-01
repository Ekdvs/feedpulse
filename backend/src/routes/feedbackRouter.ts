import express from "express";
import { deleteFeedbackById, getFeedbackById, getFeedbackSummary, getWeeklySummary, listFeedbacks, retriggerAIById, submitFeedback, updateFeedbackStatusById } from "../controllers/feedbackController";
import { adminAuth } from "../middleware/admin";

const feedbackRouter = express.Router();

feedbackRouter.get('/summary',adminAuth,getFeedbackSummary)
feedbackRouter.get('/weekly-summary',adminAuth,getWeeklySummary)

feedbackRouter.post('/',submitFeedback);
feedbackRouter.get('/',adminAuth,listFeedbacks);
feedbackRouter.get('/:id',adminAuth,getFeedbackById);
feedbackRouter.delete('/:id',adminAuth,deleteFeedbackById);
feedbackRouter.patch('/:id',adminAuth,updateFeedbackStatusById);
feedbackRouter.put('/:id/retrigger-ai',adminAuth,retriggerAIById);

export default feedbackRouter;