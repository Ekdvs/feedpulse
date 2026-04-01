"use client";
import { ReactNode, useState } from "react";


interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4 font-bold text-xl border-b">
          {sidebarOpen ? "FeedPulse" : "FP"}
        </div>
        <nav className="mt-4">
          <a
            href="/dashboard"
            className="block py-2 px-4 hover:bg-gray-200 rounded"
          >
            Dashboard
          </a>
          <a
            href="/admin-dashboard/feedbacks"
            className="block py-2 px-4 hover:bg-gray-200 rounded"
          >
            Feedbacks
          </a>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block mt-4 py-2 px-4 w-full text-left hover:bg-gray-200 rounded"
          >
            {sidebarOpen ? "Collapse" : "Expand"}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {children}
      </div>

      
    </div>
  );
}