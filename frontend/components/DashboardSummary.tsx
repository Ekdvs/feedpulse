"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import API from "@/utils/api";
import toast from "react-hot-toast";
import Loader from "./Loader";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function DashboardSummary() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get("/feedback/summary");
        setSummary(res.data.data);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to fetch summary");
      }
    };
    fetchSummary();
  }, []);

  if (!summary) return <Loader/>

  // Pie chart data for Open vs Closed
  const openClosedData = {
    labels: summary.chartData.openClosed.labels,
    datasets: [
      {
        data: summary.chartData.openClosed.values,
        backgroundColor: ["#3B82F6", "#10B981"],
      },
    ],
  };

  

  // Bar chart data for Sentiments
  const sentimentData = {
    labels: summary.chartData.sentiments.labels,
    datasets: [
      {
        label: "Feedback count",
        data: summary.chartData.sentiments.values,
        backgroundColor: ["#10B981", "#9CA3AF", "#EF4444"],
      },
    ],
  };

  // Horizontal bar chart for Top Tags
  const topTagsData = {
    labels: summary.chartData.topTags.labels,
    datasets: [
      {
        label: "Count",
        data: summary.chartData.topTags.values,
        backgroundColor: "#3B82F6",
      },
    ],
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Feedback Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-500">Total Feedbacks</h2>
          <p className="text-xl font-bold">{summary.totalFeedbacks}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-500">Open Feedbacks</h2>
          <p className="text-xl font-bold">{summary.openItems}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-500">Closed Feedbacks</h2>
          <p className="text-xl font-bold">{summary.closedItems}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-500">Avg Priority</h2>
          <p className="text-xl font-bold">{summary.avgPriority.toFixed(1)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Open vs Closed Feedback</h3>
          <Pie data={openClosedData} />
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Sentiment Breakdown</h3>
          <Bar data={sentimentData} options={{ indexAxis: "y", responsive: true }} />
        </div>
      </div>

      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Top Tags</h3>
        <Bar data={topTagsData} options={{ indexAxis: "y", responsive: true }} />
      </div>
    </div>
  );
}