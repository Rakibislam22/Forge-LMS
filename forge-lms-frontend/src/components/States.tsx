"use client";

export function CourseSkeletonCard() {
  return (
    <div
      role="status"
      aria-label="Loading course"
      className="bg-white border border-[#E2DED5] rounded-[14px] overflow-hidden flex flex-col animate-pulse min-h-[380px]"
    >
      <div className="h-[176px] bg-[#E9E5DB]" />
      <div className="p-[22px] flex flex-col gap-3.5 flex-1">
        <div className="h-[22px] w-[80%] rounded-[6px] bg-[#E9E5DB]" />
        <div className="h-[14px] w-full rounded-[6px] bg-[#EFECE4]" />
        <div className="h-[14px] w-[92%] rounded-[6px] bg-[#EFECE4]" />
        <div className="h-[14px] w-[60%] rounded-[6px] bg-[#EFECE4]" />
        <div className="mt-auto pt-5 flex justify-between items-center">
          <div className="h-[24px] w-16 rounded-[6px] bg-[#E9E5DB]" />
          <div className="h-[18px] w-28 rounded-[6px] bg-[#EFECE4]" />
        </div>
      </div>
      <div className="mt-auto px-[22px] pb-[22px] text-[14px] text-[#5B606B]">
        Loading courses…
      </div>
    </div>
  );
}

export function CourseSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <CourseSkeletonCard key={idx} />
      ))}
    </div>
  );
}

export function EmptyCoursesState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <div className="bg-white border border-dashed border-[#B9B3A5] rounded-[14px] p-8 sm:p-12 flex flex-col items-center justify-center text-center gap-3.5 max-w-[560px] mx-auto my-8">
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="8"
          y="14"
          width="48"
          height="36"
          rx="6"
          fill="none"
          stroke="#15171C"
          strokeWidth="3"
        />
        <path d="M8 24h48" stroke="#15171C" strokeWidth="3" />
        <circle cx="32" cy="38" r="5" fill="#C2410C" />
      </svg>
      <h3 className="m-0 font-['Space_Grotesk'] text-[22px] font-bold text-[#15171C]">
        No courses yet
      </h3>
      <p className="m-0 text-[15px] leading-[1.5] text-[#5B606B] max-w-[280px]">
        Courses appear here as soon as an admin publishes the first one. Check back soon.
      </p>
      <button
        onClick={onRefresh}
        className="mt-2 inline-flex items-center justify-center min-h-[44px] px-5 border border-[#15171C] rounded-[10px] font-semibold text-[15px] text-[#15171C] bg-white hover:bg-[#F6F4EF] active:bg-[#E2DED5] transition-colors cursor-pointer"
      >
        Refresh list
      </button>
    </div>
  );
}

export function ErrorCoursesState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="bg-white border border-[#E2DED5] rounded-[14px] p-8 sm:p-12 flex flex-col items-center justify-center text-center gap-3.5 max-w-[560px] mx-auto my-8"
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M32 8 58 54H6z"
          fill="none"
          stroke="#B42318"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M32 26v14"
          stroke="#B42318"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="32" cy="47" r="2.5" fill="#B42318" />
      </svg>
      <h3 className="m-0 font-['Space_Grotesk'] text-[22px] font-bold text-[#15171C]">
        Couldn&apos;t load courses
      </h3>
      <p className="m-0 text-[15px] leading-[1.5] text-[#5B606B] max-w-[280px]">
        The server didn&apos;t respond. Check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="mt-2 inline-flex items-center justify-center min-h-[44px] px-6 rounded-[10px] bg-[#C2410C] text-white font-semibold text-[15px] hover:bg-[#A8370A] active:bg-[#8D2D06] transition-colors cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
