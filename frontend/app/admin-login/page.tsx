"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import API from "@/utils/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("auth/login", { email, password });

      if (data.success && data.data?.token) {
        localStorage.setItem("token", data.data.token); // store token
        toast.success("Login successful!");
        router.push("/dashboard"); // navigate to dashboard
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
          Admin Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white w-full transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white w-full transition"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`py-3 px-6 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 font-semibold ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}