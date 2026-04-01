import { Request, Response } from "express";
import Feedback from "../models/feedbackModel";
import { analyzeFeedback } from "../services/geminiService";
import mongoose from "mongoose";

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
                { returnDocument: "after" } 
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
        console.error("List Feedbacks Error:", error);

        return response.status(500).json({
            message: "An error occurred while listing feedbacks.",
            error: true,
            success: false,
        });
    }
}

//feedback get by id
export const getFeedbackById = async (request: Request, response: Response) => {
    try {
        const id= request.params.id as string;
        

        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "Feedback ID is required.",
                error: true,
                success: false,
            });
        }
        

        const feedback = await Feedback.findById(id);
        if(!feedback) {
            return response.status(404).json({
                message: "Feedback not found.",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
            message: "Feedback retrieved successfully.",
            error: false,
            success: true,
            data: feedback,
        });

    } catch (error:any) {
        console.error("Get Feedback By ID Error:", error);

        return response.status(500).json({
            message: "An error occurred while retrieving feedback.",
            error: true,
            success: false,
        });
    }
}

//update feedback status by id
export const updateFeedbackStatusById = async (request: Request, response: Response) => {
    try {
        const  id  = request.params.id as string;
        const { status } = request.body;

        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "Feedback ID is required.",
                error: true,
                success: false,
            });
        }
        

        const validStatuses = ["New", "In Review", "Resolved"];
        if (!status || !validStatuses.includes(status)) {
            return response.status(400).json({
                message: "Invalid status.",
                error: true,
                success: false,
            });
        }

        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { status },
            { returnDocument: "after" }
            
        );
        
        if(!feedback) {
            return response.status(404).json({
                message: "Feedback not found.",
                error: true,
                success: false,
            });
        }
        return response.status(200).json({
            message: "Feedback status updated successfully.",
            error: false,
            success: true,
            data: feedback,
        });
        
    } catch (error:any) {
        console.error("Update Feedback Status Error:", error);

        return response.status(500).json({
            message: "An error occurred while updating feedback status.",
            error: true,
            success: false,
        });
        
    }
}

//delete feedback by id
export const deleteFeedbackById = async (request: Request, response: Response) => {
    try {
        const  id  = request.params.id as string;

        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "Feedback ID is required.",
                error: true,
                success: false,
            });
        }

        const feedback = await Feedback.findByIdAndDelete(id);
        if(!feedback) {
            return response.status(404).json({
                message: "Feedback not found.",
                error: true,
                success: false,
            });
        }
        return response.status(200).json({
            message: "Feedback deleted successfully.",
            error: false,
            success: true,
        });
        
    } catch (error:any) {
        console.error("Delete Feedback Error:", error);

        return response.status(500).json({
            message: "An error occurred while deleting feedback.",
            error: true,
            success: false,
        });
    }

}

//get feedback summary
export const getFeedbackSummary = async (request: Request, response: Response) => {
    try {
        const totalFeedbacks = await Feedback.countDocuments();
        const openItems = await Feedback.countDocuments({ status: { $in: ["New", "In Review"] } });
        const colsedItems = await Feedback.countDocuments({ status: "Resolved" });
        const avgPriorityAgg = await Feedback.aggregate([
            { $match: { ai_processed: true } },
            { $group: { _id: null, avgPriority: { $avg: "$ai_priority" } } }
        ]);
        const avgPriority = avgPriorityAgg[0]?.avgPriority || 0;

        //most common tags
        const tagsAgg = await Feedback.aggregate([
            { $unwind: "$ai_tags" },
            { $group: { _id: "$ai_tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);
        const commonTags = tagsAgg.map((tag) => ({ tag: tag._id, count: tag.count }));

        return response.status(200).json(
            {
                error:false,
                success:true,
                data:{
                    totalFeedbacks,
                    openItems,
                    colsedItems,
                    avgPriority,
                    commonTags

                }
            }
        )

    } catch (error:any) {
        console.error("Get Feedback Summary Error:", error);

        return response.status(500).json({
            message: "An error occurred while getting feedback summary.",
            error: true,
            success: false,
        });
        
    }
}

//retrigger AI analysis for a feedback by id
export const retriggerAIById = async (request: Request, response: Response) => {
    try {
        const  id  = request.params.id as string;

        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "Feedback ID is required.",
                error: true,
                success: false,
            });
        }
        const feedback = await Feedback.findById(id);
        if(!feedback) {
            return response.status(404).json({
                message: "Feedback not found.",
                error: true,
                success: false,
            });
        }
        const aiData = await analyzeFeedback(feedback.title, feedback.description);

        if (aiData) {
            feedback.ai_category = aiData.category;
            feedback.ai_sentiment = aiData.sentiment;
            feedback.ai_priority = aiData.priority_score;
            feedback.ai_summary = aiData.summary;
            feedback.ai_tags = aiData.tags;
            feedback.ai_processed = true;
            await feedback.save();

            return response.status(200).json({
                message: "AI analysis retriggered successfully.",
                error: false,
                success: true,
                data: feedback,
            });
        }
            else {
                return response.status(400).json({
                    message: "Failed to retrigger AI analysis.",
                    error: true,
                    success: false,
                });
            }

    } catch (error:any) {
        console.error("Retrigger AI Analysis Error:", error);

        return response.status(500).json({
            message: "An error occurred while retriggering AI analysis.",
            error: true,
            success: false,
        });
        
    }
}