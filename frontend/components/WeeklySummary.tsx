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

// Types
interface DailyData {
  date: string;
  count: number;
  positive: number;
  negative: number;
  neutral: number;
}

interface Theme {
  title: string;
  description: string;
}

export default function DashboardWeeklySummary() {
  const [weeklyData, setWeeklyData] = useState<DailyData[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklySummary = async () => {
      try {
        const res = await API.get("/feedback/weekly-summary");

        if (res.data.success) {
          const data = res.data.data;

          setWeeklyData(data.dailyBreakdown || []);
          setThemes(data.topThemes || []);
          setInsight(data.overallInsight || "");
        } else {
          toast.error("Failed to fetch weekly summary");
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "Error fetching weekly summary"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklySummary();
  }, []);

  if (loading) return <Loader />;
  if (!weeklyData.length) return <p>No feedback in the last 7 days.</p>;

  // Stats
  const totalFeedbacks = weeklyData.reduce((acc, d) => acc + d.count, 0);
  const totalPositive = weeklyData.reduce((acc, d) => acc + d.positive, 0);
  const totalNeutral = weeklyData.reduce((acc, d) => acc + d.neutral, 0);
  const totalNegative = weeklyData.reduce((acc, d) => acc + d.negative, 0);

  const isNegativeDominant = totalNegative > totalPositive;

  // Chart Data
  const chartData = {
    labels: weeklyData.map((d) => d.date),
    datasets: [
      {
        label: "Positive",
        data: weeklyData.map((d) => d.positive),
        backgroundColor: "rgba(34,197,94,0.7)",
      },
      {
        label: "Neutral",
        data: weeklyData.map((d) => d.neutral),
        backgroundColor: "rgba(156,163,175,0.7)",
      },
      {
        label: "Negative",
        data: weeklyData.map((d) => d.negative),
        backgroundColor: "rgba(239,68,68,0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Weekly Feedback Sentiment Breakdown",
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        📊 Weekly Feedback Summary
      </h1>

      {/* 🚨 Alert Banner */}
      {isNegativeDominant && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
          ⚠️ High negative feedback detected this week!
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total" value={totalFeedbacks} />
        <Card title="Positive" value={totalPositive} color="green" />
        <Card title="Neutral" value={totalNeutral} color="gray" />
        <Card title="Negative" value={totalNegative} color="red" />
      </div>

      {/* 🤖 AI Insights */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          🤖 AI Insights (Last 7 Days)
        </h2>

        {/* Insight */}
        {insight && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <p className="text-gray-700">{insight}</p>
          </div>
        )}

        {/* Themes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg mb-2">
                🔹 {theme.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {theme.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded p-4">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

// 🔥 Reusable Card Component
function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color?: "green" | "red" | "gray";
}) {
  const colorMap: any = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-gray-200 text-gray-800",
  };

  return (
    <div className={`shadow rounded p-4 ${colorMap[color] || "bg-white"}`}>
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}