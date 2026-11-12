"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { Course, Lecture, ApiResponse, CourseDetailResponse } from "@/types/course";

export default function AdminLecturesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add / Edit lecture form state
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCourseAndLectures = async () => {
    setLoading(true);
    setError(null);
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
      setLectures(json.data.lectures || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading lectures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
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

        if (!ignore) {
          setCourse(json.data.course);
          setLectures(json.data.lectures || []);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error loading lectures");
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [courseId]);

  const resetForm = () => {
    setEditingLecture(null);
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setFormError(null);
  };

  const startEdit = (lec: Lecture) => {
    setEditingLecture(lec);
    setTitle(lec.title);
    setDescription(lec.description || "");
    setVideoUrl(lec.videoUrl);
    setFormError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("forge_admin_token") : "";
      const isEdit = Boolean(editingLecture);
      const lecId = editingLecture?.id || editingLecture?._id;

      const apiUrl = isEdit
        ? (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lectures/${lecId}` : `/api/courses/${courseId}/lectures/${lecId}`)
        : (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lectures` : `/api/courses/${courseId}/lectures`);

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
          videoUrl,
          order: isEdit ? editingLecture?.order : lectures.length + 1,
        }),
      });

      const json: ApiResponse<{ lecture: Lecture }> = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to save lecture");
      }

      resetForm();
      await fetchCourseAndLectures();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save lecture");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLecture = async (lecId: string) => {
    if (!confirm("Are you sure you want to delete this lecture?")) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("forge_admin_token") : "";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lectures/${lecId}`
        : `/api/courses/${courseId}/lectures/${lecId}`;

      const res = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete lecture");

      setLectures((prev) => prev.filter((l) => (l.id || l._id) !== lecId));
      if (editingLecture && (editingLecture.id || editingLecture._id) === lecId) {
        resetForm();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete lecture");
    }
  };

  return (
    <div className="font-sans text-[#15171C] bg-[#F6F4EF] min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 flex flex-col gap-7">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/admin/courses"
            className="text-[14px] text-[#5B606B] underline hover:text-[#15171C] self-start"
          >
            ← Back to courses
          </Link>
          <h1 className="m-0 font-['Space_Grotesk'] font-bold text-[32px] sm:text-[36px] tracking-[-0.02em] text-[#15171C]">
            Lectures
          </h1>
          <p className="m-0 text-[15px] text-[#5B606B]">
            {course?.title || "Course"} · {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[#5B606B] animate-pulse">
            Loading lectures…
          </div>
        ) : error ? (
          <div className="p-8 text-center text-[#B42318]">{error}</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: Lectures list */}
            <section className="flex-1 w-full bg-white border border-[#E2DED5] rounded-[14px] overflow-hidden shadow-sm">
              {lectures.length === 0 ? (
                <div className="p-10 text-center text-[#5B606B]">
                  No lectures in this course yet. Use the form to add the first lecture.
                </div>
              ) : (
                <ol className="list-none m-0 p-0 divide-y divide-[#E2DED5]">
                  {lectures.map((lec, idx) => {
                    const lecId = lec.id || lec._id || String(idx);
                    const isSelected = editingLecture && (editingLecture.id || editingLecture._id) === lecId;

                    return (
                      <li
                        key={lecId}
                        className={`flex flex-wrap items-center gap-3 sm:gap-4 p-4 sm:p-[16px_22px] transition-colors ${
                          isSelected ? "bg-[#FBE9DF]" : "hover:bg-[#FBFAF7]"
                        }`}
                      >
                        <span className="shrink-0 w-9 h-9 rounded-full bg-[#F6F4EF] flex items-center justify-center font-['Space_Grotesk'] font-bold text-[14px] text-[#15171C]">
                          {lec.order || idx + 1}
                        </span>

                        <div className="flex-1 min-w-[200px] flex flex-col gap-0.5">
                          <span className="font-semibold text-[15.5px] text-[#15171C]">
                            {lec.title}
                          </span>
                          <span className="text-[13px] text-[#5B606B] break-all">
                            {lec.videoUrl}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(lec)}
                            className="px-3 py-1.5 rounded-lg font-semibold text-[14px] text-[#15171C] hover:bg-[#F6F4EF] border-0 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLecture(lecId)}
                            className="px-3 py-1.5 rounded-lg font-semibold text-[14px] text-[#B42318] hover:bg-[#B42318]/10 border-0 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>

            {/* Right: Add/Edit Lecture Form */}
            <form
              onSubmit={handleFormSubmit}
              className="w-full lg:w-[360px] shrink-0 bg-white border border-[#E2DED5] rounded-[14px] p-6 flex flex-col gap-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="m-0 font-['Space_Grotesk'] font-bold text-[20px] text-[#15171C]">
                  {editingLecture ? "Edit lecture" : "Add lecture"}
                </h2>
                {editingLecture && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-[13px] text-[#5B606B] hover:text-[#15171C] underline border-0 bg-transparent cursor-pointer"
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              {formError && (
                <div role="alert" className="p-3 border border-[#B42318] rounded-lg text-[#B42318] text-[13px]">
                  {formError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="lt" className="text-[14px] font-semibold text-[#15171C]">
                  Title
                </label>
                <input
                  id="lt"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to MERN"
                  className="w-full min-h-[44px] px-3.5 border border-[#9A9588] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ld" className="text-[14px] font-semibold text-[#15171C]">
                  Description
                </label>
                <textarea
                  id="ld"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What this lecture covers…"
                  className="w-full p-3 border border-[#9A9588] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C2410C] resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="lu" className="text-[14px] font-semibold text-[#15171C]">
                  Video URL
                </label>
                <input
                  id="lu"
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=…"
                  className="w-full min-h-[44px] px-3.5 border border-[#9A9588] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
                <span className="text-[12px] text-[#5B606B]">
                  YouTube (watch, embed, youtu.be) or Vimeo link.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[46px] rounded-[10px] bg-[#C2410C] text-white font-semibold text-[15px] hover:bg-[#A8370A] disabled:opacity-60 cursor-pointer mt-1"
              >
                {submitting
                  ? "Saving…"
                  : editingLecture
                  ? "Update lecture"
                  : "Add lecture"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
