"use client";

import { useEffect, useState } from "react";
import { Course, ApiResponse, CoursesResponse } from "@/types/course";
import CourseCard from "@/components/CourseCard";
import {
  CourseSkeletonGrid,
  EmptyCoursesState,
  ErrorCoursesState,
} from "@/components/States";

interface CourseListingProps {
  initialCourses?: Course[];
}

export default function CourseListing({ initialCourses }: CourseListingProps) {
  const [courses, setCourses] = useState<Course[] | null>(
    initialCourses || null
  );
  const [loading, setLoading] = useState<boolean>(!initialCourses);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/courses`
          : "/api/courses";

        const res = await fetch(apiUrl, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const json: ApiResponse<CoursesResponse> = await res.json();

        if (!json.success || !json.data) {
          throw new Error(json.error?.message || "Failed to load courses");
        }

        if (!ignore) {
          setCourses(json.data.courses || []);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error loading courses:", err);
          setError(err instanceof Error ? err.message : "Network error");
          setLoading(false);
        }
      }
    }

    if (!initialCourses) {
      load();
    }

    return () => {
      ignore = true;
    };
  }, [initialCourses]);

  const handleRetryOrRefresh = () => {
    setLoading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/courses`
      : "/api/courses";

    fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((json: ApiResponse<CoursesResponse>) => {
        if (!json.success || !json.data) {
          throw new Error(json.error?.message || "Failed to load courses");
        }
        setCourses(json.data.courses || []);
      })
      .catch((err) => {
        console.error("Error reloading courses:", err);
        setError(err instanceof Error ? err.message : "Network error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <CourseSkeletonGrid count={6} />;
  }

  if (error) {
    return <ErrorCoursesState onRetry={handleRetryOrRefresh} />;
  }

  if (!courses || courses.length === 0) {
    return <EmptyCoursesState onRefresh={handleRetryOrRefresh} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id || course._id} course={course} />
      ))}
    </div>
  );
}
