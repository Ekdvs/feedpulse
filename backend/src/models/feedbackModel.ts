import { Schema, model, Document } from "mongoose";

export interface IFeedback extends Document {
    title: string;
    description: string;
    category: "Bug" | "Feature Request" | "Improvement" | "Other";
    status: "New" | "In Review" | "Resolved";
    submitterName?: string;
    submitterEmail?: string;
    ai_category?: string;
    ai_sentiment?: "Positive" | "Neutral" | "Negative";
    ai_priority?: number;
    ai_summary?: string;
    ai_tags?: string[];
    ai_processed?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
    {
        title:{
            type: String,
            required: true,
            maxlength:120
        },
        description:{
            type: String,
            required: true,
            minlength: 20
        },
        category:{
            type: String,
            enum: ["Bug", "Feature Request", "Improvement", "Other"],
            required: true
        },
        status:{
            type: String,
            enum: ["New", "In Review", "Resolved"],
            default: "New"
        },
        submitterName:{
            type: String,
            maxlength: 50
        },
        submitterEmail:{
            type: String,
            maxlength: 100,
            match: /^\S+@\S+\.\S+$/
        },
        ai_category: {
            type: String,
        },
        ai_sentiment: {
            type: String,
            enum: ["Positive", "Neutral", "Negative"]
        },
        ai_priority:{
            type: Number,
            min: 1,
            max: 10
        },
        ai_summary: {
            type: String,
            maxlength: 200
        },
        ai_tags: {
            type: [String]
        },
        ai_processed: {
            type: Boolean,
            default: false
        }

    },
    { 
        timestamps: true 
    }
);

feedbackSchema.index({status: 1, category: 1, createdAt: -1,ai_priority: -1});

const Feedback = model<IFeedback>("Feedback", feedbackSchema);

export default Feedback;