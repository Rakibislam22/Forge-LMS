"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminCourseForm from "@/components/AdminCourseForm";

export default function NewCoursePage() {
  return (
    <div className="font-sans text-[#15171C] bg-[#F6F4EF] min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10">
        <AdminCourseForm isEdit={false} />
      </main>
    </div>
  );
}
