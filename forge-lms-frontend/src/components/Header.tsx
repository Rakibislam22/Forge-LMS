"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminSession } from "@/utils/auth";

interface HeaderProps {
  activeTab?: "courses" | "dashboard" | "admin";
  backHref?: string;
  backLabel?: string;
}

function getAdminSnapshot() {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(localStorage.getItem("forge_admin_token"));
  } catch {
    return false;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function Header({ activeTab, backHref, backLabel }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = useSyncExternalStore(subscribe, getAdminSnapshot, () => false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAdminSession();
    router.push("/");
  };

  const isDashboardActive =
    activeTab === "dashboard" || pathname.startsWith("/dashboard");

  const isCoursesActive =
    (activeTab === "courses" ||
      pathname === "/" ||
      pathname.startsWith("/courses")) &&
    !isDashboardActive;

  const isAdminActive =
    activeTab === "admin" || pathname.startsWith("/admin");

  return (
    <header className="border-b border-[#E2DED5] bg-white sticky top-0 z-40 shadow-[0_1px_3px_rgba(21,23,28,0.03)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-10 min-h-[60px] sm:min-h-[72px] flex items-center justify-between gap-4">
        {/* Brand / Left Logo */}
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-semibold text-[#15171C] hover:text-[#C2410C] transition-colors py-1.5 px-2 -ml-2 rounded-lg"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
                <path d="M11 3 5 9l6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{backLabel || "Back"}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2.5 font-['Space_Grotesk'] font-bold text-[21px] sm:text-[22px] text-[#15171C] hover:opacity-90 transition-opacity"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                aria-hidden="true"
                className="shrink-0"
              >
                <rect width="28" height="28" rx="6" fill="#15171C" />
                <path d="M8 20V8h12v4h-8v2h6v4h-6v2z" fill="#F6F4EF" />
              </svg>
              <span>Forge</span>
            </Link>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3">
          <Link
            href="/"
            className={`px-3.5 py-2 text-[15px] font-semibold transition-colors rounded-lg ${
              isCoursesActive && !isAdminActive
                ? "text-[#C2410C] bg-[#FBE9DF]"
                : "text-[#15171C] hover:text-[#C2410C]"
            }`}
          >
            Courses
          </Link>

          <Link
            href="/dashboard"
            className={`px-3.5 py-2 text-[15px] font-semibold transition-colors rounded-lg flex items-center gap-1.5 ${
              isDashboardActive
                ? "text-[#C2410C] bg-[#FBE9DF]"
                : "text-[#15171C] hover:text-[#C2410C]"
            }`}
          >
            <span>Student Dashboard</span>
          </Link>

          {isAdmin ? (
            <div className="flex items-center gap-3">
              <Link
                href="/admin/courses"
                className={`px-3.5 py-2 text-[15px] font-semibold transition-colors rounded-lg ${
                  isAdminActive
                    ? "text-[#C2410C] bg-[#FBE9DF]"
                    : "text-[#15171C] hover:text-[#C2410C]"
                }`}
              >
                Admin Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 border border-[#E2DED5] rounded-[8px] text-[14px] font-semibold text-[#5B606B] hover:text-[#B42318] hover:border-[#B42318] transition-colors cursor-pointer bg-white"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="px-4 py-2 min-h-[38px] border border-[#15171C] rounded-[8px] text-[15px] font-semibold text-[#15171C] hover:bg-[#15171C] hover:text-[#F6F4EF] transition-all flex items-center justify-center"
            >
              Admin login
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          aria-label="Toggle Navigation"
          className="md:hidden p-2 rounded-lg text-[#15171C] hover:bg-[#F6F4EF] transition-colors cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2DED5] bg-white px-5 py-4 flex flex-col gap-3 shadow-xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2 text-[15px] font-semibold flex items-center justify-between ${
              isCoursesActive && !isAdminActive ? "text-[#C2410C]" : "text-[#15171C]"
            }`}
          >
            <span>Courses</span>
            <span className="text-[13px] text-[#5B606B]">Browse</span>
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2 text-[15px] font-semibold flex items-center justify-between ${
              isDashboardActive ? "text-[#C2410C]" : "text-[#15171C]"
            }`}
          >
            <span>Student Dashboard</span>
            <span className="text-[13px] text-[#5B606B]">My Learning</span>
          </Link>

          {isAdmin ? (
            <>
              <Link
                href="/admin/courses"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-[15px] font-semibold ${
                  isAdminActive ? "text-[#C2410C]" : "text-[#15171C]"
                }`}
              >
                Admin Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-left py-2 text-[15px] font-semibold text-[#B42318] bg-transparent border-0 cursor-pointer"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-4 text-center border border-[#15171C] rounded-[8px] text-[15px] font-semibold text-[#15171C] hover:bg-[#15171C] hover:text-[#F6F4EF] mt-1"
            >
              Admin login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
