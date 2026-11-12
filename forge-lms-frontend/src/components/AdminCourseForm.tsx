"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Course, ApiResponse } from "@/types/course";

interface CourseFormProps {
  initialCourse?: Course;
  isEdit?: boolean;
}

export default function AdminCourseForm({ initialCourse, isEdit = false }: CourseFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialCourse?.title || "");
  const [description, setDescription] = useState(initialCourse?.description || "");
  const [price, setPrice] = useState(initialCourse ? String(initialCourse.price) : "49");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialCourse?.thumbnailUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  const validatePrice = (val: string) => {
    const num = Number(val);
    if (isNaN(num) || num < 0) {
      setPriceError("Price must be 0 or more.");
      return false;
    }
    setPriceError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePrice(price)) return;

    setLoading(true);
    setError(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("forge_admin_token") : "";
      const id = initialCourse?.id || initialCourse?._id;

      const apiUrl = isEdit
        ? (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}` : `/api/courses/${id}`)
        : (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/courses` : "/api/courses");

      const res = await fetch(apiUrl, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          thumbnailUrl,
        }),
      });

      const json: ApiResponse<{ course: Course }> = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to save course");
      }

      router.push("/admin/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  const previewTag = title.split(" ")[0].slice(0, 5).toUpperCase() || "CODE";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/courses"
          className="text-[14px] text-[#5B606B] underline hover:text-[#15171C] self-start"
        >
          ← Back to courses
        </Link>
        <h1 className="m-0 font-['Space_Grotesk'] font-bold text-[32px] sm:text-[36px] tracking-[-0.02em] text-[#15171C]">
          {isEdit ? "Edit course" : "New course"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-8 items-start"
      >
        {/* Left Form Box */}
        <div className="flex-1 w-full bg-white border border-[#E2DED5] rounded-[14px] p-6 sm:p-7 flex flex-col gap-5 shadow-sm">
          {error && (
            <div
              role="alert"
              className="p-3.5 border border-[#B42318] rounded-[10px] text-[#B42318] text-[14px] bg-[#B42318]/5"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-[14px] font-semibold text-[#15171C]">
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              minLength={3}
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full-Stack Web Development with MERN"
              className="w-full min-h-[48px] px-3.5 border border-[#9A9588] rounded-[10px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="desc" className="text-[14px] font-semibold text-[#15171C]">
              Description
            </label>
            <textarea
              id="desc"
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a clear overview of what students will learn…"
              className="w-full p-3.5 border border-[#9A9588] rounded-[10px] text-[15px] leading-[1.5] resize-y focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1 flex flex-col gap-1.5">
              <label htmlFor="price" className="text-[14px] font-semibold text-[#15171C]">
                Price (USD)
              </label>
              <input
                id="price"
                type="text"
                inputMode="decimal"
                required
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  validatePrice(e.target.value);
                }}
                className={`w-full min-h-[48px] px-3.5 rounded-[10px] text-[15px] focus:outline-none focus:ring-2 ${
                  priceError
                    ? "border-2 border-[#B42318] focus:ring-[#B42318]"
                    : "border border-[#9A9588] focus:ring-[#C2410C]"
                }`}
              />
              {priceError && (
                <span role="alert" className="text-[13px] text-[#B42318]">
                  {priceError}
                </span>
              )}
            </div>

            <div className="flex-[2] flex flex-col gap-1.5">
              <label htmlFor="thumb" className="text-[14px] font-semibold text-[#15171C]">
                Thumbnail URL
              </label>
              <input
                id="thumb"
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://example.com/images/course.jpg"
                className="w-full min-h-[48px] px-3.5 border border-[#9A9588] rounded-[10px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2DED5] mt-2">
            <Link
              href="/admin/courses"
              className="inline-flex items-center justify-center min-h-[46px] px-5 border border-[#15171C] rounded-[10px] text-[15px] font-semibold text-[#15171C] hover:bg-[#F6F4EF]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || Boolean(priceError)}
              className="inline-flex items-center justify-center min-h-[46px] px-6 rounded-[10px] bg-[#C2410C] text-white font-semibold text-[15px] hover:bg-[#A8370A] disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Saving…" : "Save course"}
            </button>
          </div>
        </div>

        {/* Right Preview Box */}
        <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-3">
          <span className="text-[14px] font-semibold text-[#15171C]">
            Thumbnail preview
          </span>
          <div className="relative aspect-[16/10] rounded-[14px] overflow-hidden bg-[#1F3A5F] shadow-sm">
            {thumbnailUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={thumbnailUrl}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full relative">
                <div className="absolute -right-10 -top-14 w-[220px] h-[220px] rounded-full bg-[#2E5283]" />
                <div className="absolute left-6 top-5 font-['Space_Grotesk'] font-bold text-[44px] text-white tracking-[-0.02em]">
                  {previewTag}
                </div>
              </div>
            )}
          </div>
          <p className="m-0 text-[13px] leading-[1.5] text-[#5B606B]">
            Shows how the course card will look to students. Use a direct image link.
          </p>
        </aside>
      </form>
    </div>
  );
}
