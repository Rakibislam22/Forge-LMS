import { NextResponse } from "next/server";
import { coursesStore, lecturesStore } from "../../../_data/store";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lectures = lecturesStore.filter((l) => l.courseId === id);

  return NextResponse.json({
    success: true,
    data: { lectures },
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;
  const course = coursesStore.find((c) => c.id === courseId || c._id === courseId);

  if (!course) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Course not found" } },
      { status: 404 }
    );
  }

  const body = await req.json();
  const currentCount = lecturesStore.filter((l) => l.courseId === courseId).length;

  const newLecture = {
    id: "6732dc02f1a2b3c4d5e6f" + Math.floor(100 + Math.random() * 900),
    courseId,
    title: body.title,
    description: body.description || "",
    videoUrl: body.videoUrl,
    order: Number(body.order) || currentCount + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  lecturesStore.push(newLecture);
  course.lectureCount = (course.lectureCount || 0) + 1;

  return NextResponse.json(
    {
      success: true,
      data: { lecture: newLecture },
    },
    { status: 201 }
  );
}
