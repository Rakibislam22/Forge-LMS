"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminSession } from "@/utils/auth";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAdminSession();
    router.push("/admin/login");
  };

  const isCourses = pathname.startsWith("/admin/courses");

  return (
    <aside className="w-full md:w-[240px] shrink-0 bg-[#15171C] text-white p-5 sm:p-6 flex flex-col gap-6 md:min-h-screen">
      {/* Brand */}
      <Link
        href="/admin/courses"
        className="flex items-center gap-2.5 px-2 font-['Space_Grotesk'] font-bold text-[20px] text-white hover:opacity-90"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 28 28"
          aria-hidden="true"
          className="shrink-0"
        >
          <rect width="28" height="28" rx="6" fill="#F6F4EF" />
          <path d="M8 20V8h12v4h-8v2h6v4h-6v2z" fill="#15171C" />
        </svg>
        <span>Forge</span>
        <span className="text-[12px] font-medium text-[#C9CDD6] font-sans ml-0.5">
          Admin
        </span>
      </Link>

      {/* Nav items */}
      <nav className="flex flex-col gap-1.5 flex-1">
        <Link
          href="/admin/courses"
          className={`flex items-center gap-3 min-h-[44px] px-3 rounded-lg text-[15px] font-semibold transition-colors ${
            isCourses
              ? "bg-[#C2410C] text-white"
              : "text-[#E4E6EB] hover:bg-[#242932]"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect
              x="2"
              y="3"
              width="14"
              height="12"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path d="M2 7h14" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span>Courses</span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-3 min-h-[44px] px-3 rounded-lg text-[15px] text-[#E4E6EB] hover:bg-[#242932] transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M7 3H3v12h12v-4M10 3h5v5M15 3 8 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>View student site</span>
        </Link>
      </nav>

      {/* Logout button */}
      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 min-h-[44px] px-3 rounded-lg text-[15px] text-[#E4E6EB] hover:bg-[#242932] hover:text-[#B42318] transition-colors border-0 bg-transparent cursor-pointer text-left w-full"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          aria-hidden="true"
          className="shrink-0"
        >
          <path
            d="M7 3H3v12h4M12 5l4 4-4 4M16 9H7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Log out</span>
      </button>
    </aside>
  );
}
