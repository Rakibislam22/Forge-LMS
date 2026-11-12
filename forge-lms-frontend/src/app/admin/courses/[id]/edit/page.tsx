"use client";

import { useEffect, useState, use } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminCourseForm from "@/components/AdminCourseForm";
import { Course, ApiResponse, CourseDetailResponse } from "@/types/course";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`
          : `/api/courses/${courseId}`;

        const res = await fetch(apiUrl, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error("Failed to load course");

        const json: ApiResponse<CourseDetailResponse> = await res.json();
        if (!json.success || !json.data) throw new Error("Course not found");

        setCourse(json.data.course);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading course");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  return (
    <div className="font-sans text-[#15171C] bg-[#F6F4EF] min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10">
        {loading ? (
          <div className="p-12 text-center text-[#5B606B] animate-pulse">
            Loading course…
          </div>
        ) : error || !course ? (
          <div className="p-8 text-[#B42318] text-center">
            {error || "Course not found"}
          </div>
        ) : (
          <AdminCourseForm initialCourse={course} isEdit={true} />
        )}
      </main>
    </div>
  );
}
