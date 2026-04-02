"use client";

import { useEffect, useState } from "react";
import { FileText, Trash2, RefreshCw } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "@/utils/api";
import Loader from "./Loader";

interface Feedback {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  submitterName?: string;
  submitterEmail?: string;
  ai_category?: string;
  ai_sentiment?: string;
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [filters, setFilters] = useState({ status: "", category: "", keyword: "" });

  // Fetch feedbacks
  const fetchFeedbacks = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        ...filters,
        page: page.toString(),
        limit: pagination.limit.toString(),
      });
      const res = await API.get(`/feedback?${query.toString()}`);
      if (res.data.success) {
        setFeedbacks(res.data.data.feedbacks);
        setPagination(res.data.data.pagination);
      } else {
        toast.error("Failed to fetch feedbacks");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error fetching feedbacks");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchFeedbacks(1);
  }, []);

  // Handlers
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchFeedbacks(newPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, keyword: e.target.value });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const viewFeedbackDetails = async (id: string) => {
    try {
      const res = await API.get(`/feedback/${id}`);
      if (res.data.success) setSelectedFeedback(res.data.data);
    } catch (err: any) {
      toast.error("Failed to fetch feedback details");
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;
    try {
      const res = await API.delete(`/feedback/${id}`);
      if (res.data.success) {
        toast.success("Feedback deleted");
        fetchFeedbacks(pagination.page);
      }
    } catch (err: any) {
      toast.error("Failed to delete feedback");
    }
  };

  const retriggerAI = async (id: string) => {
    try {
      const res = await API.put(`/feedback/${id}/retrigger-ai`);
      if (res.data.success) {
        toast.success("AI analysis retriggered");
        fetchFeedbacks(pagination.page);
      }
    } catch (err: any) {
      toast.error("Failed to retrigger AI analysis");
    }
  };

  const changeStatus = async (id: string, newStatus: string) => {
    try {
      const res = await API.patch(`/feedback/${id}`, { status: newStatus });
      if (res.data.success) {
        toast.success("Status updated");
        fetchFeedbacks(pagination.page);
      }
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FileText size={32} /> Admin Feedbacks
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap items-center">
        <input
          type="text"
          placeholder="Search..."
          value={filters.keyword}
          onChange={handleSearchChange}
          className="border rounded px-3 py-2"
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="In Review">In Review</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          <option value="Bug">Bug</option>
          <option value="Feature Request">Feature Request</option>
          <option value="Improvement">Improvement</option>
          <option value="Other">Other</option>
        </select>

        {/* Search Button */}
        <button
          onClick={() => fetchFeedbacks(1)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>

        {/* Reset Button */}
        <button
          onClick={() => {
            setFilters({ status: "", category: "", keyword: "" });
            fetchFeedbacks(1);
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>

      {/* Feedback Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedbacks.map((f) => (
          <div key={f._id} className="border rounded p-4 shadow hover:shadow-lg transition relative">
            <h2 className="font-bold text-lg mb-1">{f.title}</h2>
            <p className="text-gray-600 mb-1">
              <strong>Category:</strong> {f.category}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Status:</strong> {f.status}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Priority:</strong> {f.ai_priority || "-"}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>sentiment badge:</strong> {f.ai_sentiment || "-"}
            </p>

            <select
              value={f.status}
              onChange={(e) => changeStatus(f._id, e.target.value)}
              className="border rounded px-2 py-1 text-sm mt-2"
            >
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
            </select>
            <p className="text-gray-600 mb-1">
              <strong>Date:</strong> {f.createdAt || "-"}
            </p>

            <div className="flex gap-2 mt-2 ">
              <button
                onClick={() => viewFeedbackDetails(f._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <FileText size={16} /> View
              </button>
              <button
                onClick={() => retriggerAI(f._id)}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <RefreshCw size={16} /> AI
              </button>
              <button
                onClick={() => deleteFeedback(f._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 justify-center mt-6">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>
        <span className="px-3 py-1 border rounded">
          Page {pagination.page} of {pagination.pages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>

      {/* Feedback Details Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-red-500 font-bold"
              onClick={() => setSelectedFeedback(null)}
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedFeedback.title}</h2>
            <p>
              <strong>Category:</strong> {selectedFeedback.category}
            </p>
            <p>
              <strong>Status:</strong> {selectedFeedback.status}
            </p>
            <p>
              <strong>Submitter:</strong> {selectedFeedback.submitterName} (
              {selectedFeedback.submitterEmail})
            </p>
            <p>
              <strong>AI Category:</strong> {selectedFeedback.ai_category}
            </p>
            <p>
              <strong>AI Sentiment:</strong> {selectedFeedback.ai_sentiment}
            </p>
            <p>
              <strong>AI Priority:</strong> {selectedFeedback.ai_priority}
            </p>
            <p>
              <strong>AI Summary:</strong> {selectedFeedback.ai_summary}
            </p>
            <p>
              <strong>AI Tags:</strong> {selectedFeedback.ai_tags?.join(", ")}
            </p>
            <p>
              <strong>Description:</strong> {selectedFeedback.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}