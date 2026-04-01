"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Box, Bell, FileText } from "lucide-react";
import DashboardSummary from "@/components/DashboardSummary";
import DashboardWeeklySummary from "@/components/WeeklySummary";
import Feedbacks from "@/components/Feedbacks";


const sidebarItems = [
  { key: "summary", label: "Summary", icon: FileText },
  { key: "weekly-summary", label: "Weekly Summary", icon: Box },
  { key: "feedbacks", label: "Feedbacks", icon: Bell },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("summary");
  const[token, setToken] = useState<string | null>(null);

    useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      router.push("/admin-login");
    }
  }, [router]); 

  
  if (token === null) return <p>Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-lime-300 text-gray-900 dark:text-white text-white p-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;
            return (
              <li
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer ${
                  isActive ? "bg-blue-400 text-white font-semibold" : "hover:bg-blue-200"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </li>
            );
          })}
          
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeSection === "summary" && <DashboardSummary />}
        {activeSection === "weekly-summary" && <DashboardWeeklySummary/>}
        {activeSection === "feedbacks" && <Feedbacks />}
        
      </main>
    </div>
  );
}