import Link from "next/link";

interface HeaderProps {
  activeTab?: "courses" | "admin";
}

export default function Header({ activeTab = "courses" }: HeaderProps) {
  return (
    <header className="border-b border-[#E2DED5] bg-white sticky top-0 z-30">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 min-h-[64px] sm:min-h-[72px] flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-['Space_Grotesk'] font-bold text-[22px] text-[#15171C] hover:opacity-90 transition-opacity"
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

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className={`px-3 py-2 sm:px-3.5 sm:py-3 text-[15px] font-semibold transition-colors ${
              activeTab === "courses"
                ? "text-[#C2410C]"
                : "text-[#15171C] hover:text-[#C2410C]"
            }`}
          >
            Courses
          </Link>
          <Link
            href="/admin/login"
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 min-h-[38px] border border-[#15171C] rounded-[8px] text-[15px] font-semibold text-[#15171C] hover:bg-[#15171C] hover:text-[#F6F4EF] transition-all flex items-center justify-center"
          >
            Admin login
          </Link>
        </nav>
      </div>
    </header>
  );
}
