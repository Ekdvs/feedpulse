import { Request, Response } from "express";
import Feedback from "../models/feedbackModel";
import { analyzeFeedback } from "../services/geminiService";

// submit feedback
export const submitFeedback = async (request: Request, response: Response) => {
    try {
        // Get data from request body
        const { title, description, category, submitterName, submitterEmail } = request.body;

        //Validation
        if (!title || title.length > 120) {
            return response.status(400).json({
                message: "Title is required and must be less than 120 characters.",
                error: true,
                success: false,
            });
        }

        if (!description || description.length < 20) {
            return response.status(400).json({
                message: "Description must be at least 20 characters.",
                error: true,
                success: false,
            });
        }

        const validCategories = ["Bug", "Feature Request", "Improvement", "Other"];
        if (!category || !validCategories.includes(category)) {
            return response.status(400).json({
                message: "Invalid category.",
                error: true,
                success: false,
            });
        }

        if (submitterEmail && !/^\S+@\S+\.\S+$/.test(submitterEmail)) {
            return response.status(400).json({
                message: "Invalid email.",
                error: true,
                success: false,
            });
        }


        const feedback = await Feedback.create({
            title,
            description,
            category,
            submitterName,
            submitterEmail,
            ai_processed: false,
        });

        // Run AI 
        const aiData = await analyzeFeedback(title, description);
        

        if (aiData) {
            const updatedFeedback = await Feedback.findByIdAndUpdate(
                feedback._id,
                {
                    ai_category: aiData.category,
                    ai_sentiment: aiData.sentiment,
                    ai_priority: aiData.priority_score,
                    ai_summary: aiData.summary,
                    ai_tags: aiData.tags,
                    ai_processed: true,
                },
                { new: true } 
            );

            return response.status(201).json({
                message: "Feedback submitted successfully",
                error: false,
                success: true,
                data: updatedFeedback,
            });
        } else {
            return response.status(201).json({
                message: "Feedback submitted successfully, but AI analysis failed.",
                error: false, // 
                success: true,
                data: feedback,
            });
        }



    } catch (error: any) {
        console.error("Submit Feedback Error:", error);

        return response.status(500).json({
            message: "An error occurred while submitting feedback.",
            error: true,
            success: false,
        });
    }
};

//list feedbacks filtering and pagination and search
export const listFeedbacks = async (request: Request, response: Response) => {
    try {
        const { status, category, keyword, page = 1, limit = 10 ,sortBy ="createdAt",order = "desc"} = request.query;

        const query: any = {};
        if(category) query.category = category;
        if(status) query.status = status;
        if(keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { ai_summary: { $regex: keyword, $options: "i" } }
            ];
        }

        const feedbacks = await Feedback.find(query)
            .sort({ [sortBy as string]: order === "asc" ? 1 : -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);

        const total = await Feedback.countDocuments(query);

        return response.status(200).json(
            {
                message: "Feedbacks retrieved successfully",
                error: false,
                success: true,
                data: {
                    feedbacks,
                    pagination: { 
                        total, 
                        page: +page, 
                        limit: +limit, 
                        pages: Math.ceil(total / (+limit)) 
                    },
                }
            }
        )
    } catch (error: any) {
        console.error("Submit Feedback Error:", error);

        return response.status(500).json({
            message: "An error occurred while submitting feedback.",
            error: true,
            success: false,
        });
    }
}