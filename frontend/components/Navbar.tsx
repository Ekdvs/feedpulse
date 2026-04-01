"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileOpen(false); // close mobile menu when navigating
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Feedback App
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link
              href="/admin-login"
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition"
            >
              Admin Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden relative">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
            >
              {mobileOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Mobile Menu */}
            {mobileOpen && (
              <div className="absolute top-12 right-0 w-40 bg-white dark:bg-gray-900 rounded-md shadow-lg">
                <Link
                  href="/admin-login"
                  onClick={handleLinkClick}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-md"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}