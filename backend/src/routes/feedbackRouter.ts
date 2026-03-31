import express from "express";
import { deleteFeedbackById, getFeedbackById, listFeedbacks, submitFeedback, updateFeedbackStatusById } from "../controllers/feedbackController";
import { adminAuth } from "../middleware/admin";

const feedbackRouter = express.Router();

feedbackRouter.post('/',submitFeedback);
feedbackRouter.get('/',adminAuth,listFeedbacks);
feedbackRouter.get('/:id',adminAuth,getFeedbackById);
feedbackRouter.delete('/:id',adminAuth,deleteFeedbackById);
feedbackRouter.patch('/:id',adminAuth,updateFeedbackStatusById);

export default feedbackRouter;