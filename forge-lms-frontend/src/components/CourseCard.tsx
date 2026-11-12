"use client";

import { useState } from "react";
import Link from "next/link";
import { Course } from "@/types/course";

const PALETTES = [
  { bg: "#1F3A5F", shape: "#2E5283", fg: "#FFFFFF", tag: "MERN" },
  { bg: "#C2410C", shape: "#A8370A", fg: "#FFFFFF", tag: "TS" },
  { bg: "#2F6F5E", shape: "#3F8A75", fg: "#FFFFFF", tag: "API" },
  { bg: "#E8B04A", shape: "#F2C97A", fg: "#15171C", tag: "SQL" },
  { bg: "#15171C", shape: "#2B2F38", fg: "#FFFFFF", tag: "React" },
  { bg: "#DAD3C3", shape: "#CBC2AE", fg: "#15171C", tag: "Git" },
];

function getThumbnailPreset(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("mern") || lower.includes("mongo")) return PALETTES[0];
  if (lower.includes("type") || lower.includes("ts")) return PALETTES[1];
  if (lower.includes("api") || lower.includes("rest") || lower.includes("express")) return PALETTES[2];
  if (lower.includes("sql") || lower.includes("postgres")) return PALETTES[3];
  if (lower.includes("react")) return PALETTES[4];
  if (lower.includes("git")) return PALETTES[5];

  // Hash title for stable fallback
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PALETTES.length;
  const tag = title.split(" ")[0].slice(0, 5).toUpperCase() || "CODE";
  return { ...PALETTES[index], tag };
}

export function formatPrice(price: number): string {
  if (price === 0) return "Free";
  return `$${price}`;
}

export default function CourseCard({ course }: { course: Course }) {
  const [imageFailed, setImageFailed] = useState(false);
  const courseId = course.id || course._id;
  const preset = getThumbnailPreset(course.title);

  return (
    <Link
      href={`/courses/${courseId}`}
      className="group flex flex-col bg-white border border-[#E2DED5] rounded-[14px] overflow-hidden text-inherit no-underline transition-all duration-150 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(21,23,28,0.10)] focus-visible:outline-3 focus-visible:outline-[#C2410C] focus-visible:outline-offset-2"
    >
      {/* Thumbnail Area */}
      <div className="relative h-[176px] overflow-hidden select-none">
        {course.thumbnailUrl && !imageFailed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="w-full h-full relative"
            style={{ backgroundColor: preset.bg }}
          >
            {/* Geometric circle */}
            <div
              className="absolute -right-9 -top-12 w-[190px] h-[190px] rounded-full pointer-events-none"
              style={{ backgroundColor: preset.shape }}
            />
            {/* Geometric rounded accent line */}
            <div
              className="absolute left-6 bottom-6 w-16 h-2 rounded-[4px] pointer-events-none"
              style={{ backgroundColor: preset.shape }}
            />
            {/* Tag */}
            <div
              className="absolute left-6 top-5 font-['Space_Grotesk'] font-bold text-[40px] tracking-[-0.02em] leading-none pointer-events-none"
              style={{ color: preset.fg }}
            >
              {preset.tag}
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-2.5 p-5 sm:p-[20px_22px_22px] flex-1">
        <h2 className="m-0 font-['Space_Grotesk'] font-bold text-[21px] leading-[1.2] text-[#15171C] group-hover:text-[#C2410C] transition-colors">
          {course.title}
        </h2>
        <p className="m-0 text-[15px] leading-[1.5] text-[#5B606B] line-clamp-3">
          {course.description}
        </p>

        {/* Footer info: price and CTA */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-transparent">
          <span className="font-['Space_Grotesk'] font-bold text-[22px] text-[#15171C]">
            {formatPrice(course.price)}
          </span>
          <span className="text-[15px] font-semibold text-[#C2410C] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            View course →
          </span>
        </div>
      </div>
    </Link>
  );
}
