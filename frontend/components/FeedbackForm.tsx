"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FeedbackFormData } from "../types/feedback";
import API from "@/utils/api";


export default function FeedbackForm() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    title: "",
    description: "",
    category: "Bug",
    submitterName: "",
    submitterEmail: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("feedback", formData);

      if (data.success) {
        toast.success(data.message || "Feedback submitted successfully!");
        setFormData({
          title: "",
          description: "",
          category: "Bug",
          submitterName: "",
          submitterEmail: "",
        });
      } else {
        toast.error(data.message || "Failed to submit feedback.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center sm:text-left">
        Submit Feedback
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white w-full transition"
          maxLength={120}
          required
        />

        <textarea
          name="description"
          placeholder="Description (min 20 characters)"
          value={formData.description}
          onChange={handleChange}
          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white w-full transition"
          minLength={20}
          rows={5}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white w-full transition"
        >
          <option value="Bug">Bug</option>
          <option value="Feature Request">Feature Request</option>
          <option value="Improvement">Improvement</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="submitterName"
          placeholder="Your Name (optional)"
          value={formData.submitterName}
          onChange={handleChange}
          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white w-full transition"
        />

        <input
          type="email"
          name="submitterEmail"
          placeholder="Your Email (optional)"
          value={formData.submitterEmail}
          onChange={handleChange}
          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white w-full transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`py-3 px-6 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 font-semibold ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}