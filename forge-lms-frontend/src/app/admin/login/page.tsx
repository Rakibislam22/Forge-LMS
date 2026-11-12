"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiResponse, LoginResponse } from "@/types/course";
import { API_BASE_URL } from "@/config/api";
import { setAdminSession } from "@/utils/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("forge_admin_token");
      if (token) {
        router.replace("/admin/courses");
      }
    } catch {
      // Ignore
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}/auth/login`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: ApiResponse<LoginResponse> = await res.json();

      if (!res.ok || !data.success || !data.data) {
        throw new Error(data.error?.message || "Incorrect email or password. Try again.");
      }

      // Store token and user in localStorage and cookie
      setAdminSession(data.data.token, data.data.admin);

      router.push("/admin/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect email or password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans text-[#15171C] bg-[#F6F4EF] min-h-screen flex flex-col md:flex-row">
      {/* Left Branding Hero */}
      <section className="flex-1 bg-[#15171C] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between gap-12 relative overflow-hidden min-h-[260px] md:min-h-screen">
        <div className="absolute -right-28 -bottom-28 w-[420px] h-[420px] rounded-full bg-[#1F2530] pointer-events-none" />

        <Link
          href="/"
          className="relative flex items-center gap-2.5 font-['Space_Grotesk'] font-bold text-[22px] text-white hover:opacity-90 transition-opacity"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
            <rect width="28" height="28" rx="6" fill="#F6F4EF" />
            <path d="M8 20V8h12v4h-8v2h6v4h-6v2z" fill="#15171C" />
          </svg>
          <span>Forge</span>
        </Link>

        <div className="relative flex flex-col gap-3.5 max-w-[420px]">
          <h1 className="m-0 font-['Space_Grotesk'] font-bold text-[36px] sm:text-[44px] leading-[1.05] tracking-[-0.02em]">
            Admin dashboard
          </h1>
          <p className="m-0 text-[16px] sm:text-[17px] leading-[1.55] text-[#C9CDD6]">
            Sign in to create courses and manage their lectures.
          </p>
        </div>

        <div className="relative text-[13px] text-[#5B606B]">
          Forge LMS · Evaluator credentials prefilled for convenience
        </div>
      </section>

      {/* Right Login Form */}
      <section className="flex-1 p-6 sm:p-12 lg:p-16 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[400px] flex flex-col gap-5"
        >
          <h2 className="m-0 font-['Space_Grotesk'] font-bold text-[28px] sm:text-[30px] text-[#15171C]">
            Sign in
          </h2>

          {error && (
            <div
              role="alert"
              className="flex gap-2.5 items-start p-3 sm:p-3.5 border border-[#B42318] rounded-[10px] bg-white text-[#B42318] text-[14px] leading-[1.4]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                aria-hidden="true"
                className="shrink-0 mt-0.5"
              >
                <circle cx="9" cy="9" r="8" fill="none" stroke="#B42318" strokeWidth="1.6" />
                <path d="M9 5v5" stroke="#B42318" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="9" cy="12.5" r="1" fill="#B42318" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[14px] font-semibold text-[#15171C]">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[48px] px-3.5 border border-[#9A9588] rounded-[10px] bg-white text-[#15171C] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="pw" className="text-[14px] font-semibold text-[#15171C]">
              Password
            </label>
            <input
              id="pw"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[48px] px-3.5 border border-[#9A9588] rounded-[10px] bg-white text-[#15171C] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] rounded-[10px] bg-[#C2410C] text-white font-semibold text-[16px] hover:bg-[#A8370A] active:bg-[#8D2D06] transition-colors cursor-pointer mt-1 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <Link
            href="/"
            className="text-[14px] text-[#5B606B] underline hover:text-[#15171C] transition-colors self-start py-1"
          >
            ← Back to courses
          </Link>
        </form>
      </section>
    </div>
  );
}
