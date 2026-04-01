"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bar } from "react-chartjs-2";
import API from "@/utils/api"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "./Loader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DailyData {
  date: string;
  count: number;
  positive: number;
  negative: number;
  neutral: number;
}

export default function DashboardWeeklySummary() {
  const [weeklyData, setWeeklyData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklySummary = async () => {
      try {
        const res = await API.get("/feedback/weekly-summary");
        if (res.data.success) {
          setWeeklyData(res.data.data.dailyBreakdown);
        } else {
          toast.error("Failed to fetch weekly summary");
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Error fetching weekly summary");
      } finally {
        setLoading(false);
      }
    };
    fetchWeeklySummary();
  }, []);

  if (loading) return <Loader/>;
  if (!weeklyData.length) return <p>No feedback in the last 7 days.</p>;

  const chartData = {
    labels: weeklyData.map((d) => d.date),
    datasets: [
      {
        label: "Positive",
        data: weeklyData.map((d) => d.positive),
        backgroundColor: "rgba(34,197,94,0.7)", // green
      },
      {
        label: "Neutral",
        data: weeklyData.map((d) => d.neutral),
        backgroundColor: "rgba(156,163,175,0.7)", // gray
      },
      {
        label: "Negative",
        data: weeklyData.map((d) => d.negative),
        backgroundColor: "rgba(239,68,68,0.7)", // red
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Weekly Feedback Sentiment Breakdown",
      },
    },
  };

  const totalFeedbacks = weeklyData.reduce((acc, d) => acc + d.count, 0);
  const totalPositive = weeklyData.reduce((acc, d) => acc + d.positive, 0);
  const totalNeutral = weeklyData.reduce((acc, d) => acc + d.neutral, 0);
  const totalNegative = weeklyData.reduce((acc, d) => acc + d.negative, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Weekly Feedback Summary</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-500">Total Feedbacks</h2>
          <p className="text-xl font-bold">{totalFeedbacks}</p>
        </div>
        <div className="bg-green-100 text-green-800 shadow rounded p-4">
          <h2 className="text-gray-500">Positive</h2>
          <p className="text-xl font-bold">{totalPositive}</p>
        </div>
        <div className="bg-gray-200 text-gray-800 shadow rounded p-4">
          <h2 className="text-gray-500">Neutral</h2>
          <p className="text-xl font-bold">{totalNeutral}</p>
        </div>
        <div className="bg-red-100 text-red-800 shadow rounded p-4">
          <h2 className="text-gray-500">Negative</h2>
          <p className="text-xl font-bold">{totalNegative}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded p-4">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}