export interface FeedbackFormData {
  title: string;
  description: string;
  category: "Bug" | "Feature Request" | "Improvement" | "Other";
  submitterName?: string;
  submitterEmail?: string;
}