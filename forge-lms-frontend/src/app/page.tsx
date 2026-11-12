"use client";

import { useSyncExternalStore } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseListing from "@/components/CourseListing";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function HomePage() {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div
        className="min-h-screen bg-[#F6F4EF]"
        suppressHydrationWarning
      />
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#15171C]"
      suppressHydrationWarning
    >
      <Header activeTab="courses" />

      <main
        className="flex-1 max-w-[1200px] w-full mx-auto px-5 sm:px-10 py-9 sm:py-14 md:pb-[72px]"
        suppressHydrationWarning
      >
        {/* Page Hero */}
        <div className="flex flex-col gap-3 max-w-[640px]">
          <h1 className="m-0 font-['Space_Grotesk'] font-bold text-[34px] sm:text-[42px] md:text-[48px] leading-[1.05] tracking-[-0.02em] text-[#15171C]">
            All courses
          </h1>
          <p className="m-0 text-[16px] sm:text-[18px] leading-[1.5] text-[#5B606B]">
            Pick a course, open the lecture list and start watching. No sign-up needed.
          </p>
        </div>

        {/* Listing section */}
        <div className="mt-8 sm:mt-10">
          <CourseListing />
        </div>
      </main>

      <Footer />
    </div>
  );
}
