import { NextResponse } from "next/server";
import { coursesStore, lecturesStore } from "../../../../_data/store";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; lectureId: string }> }
) {
  const { id: courseId, lectureId } = await params;
  const course = coursesStore.find((c) => c.id === courseId || c._id === courseId);

  if (!course) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Course not found" } },
      { status: 404 }
    );
  }

  const courseLectures = lecturesStore
    .filter((l) => l.courseId === courseId)
    .sort((a, b) => a.order - b.order);

  const currentIndex = courseLectures.findIndex(
    (l) => l.id === lectureId || l._id === lectureId
  );

  if (currentIndex === -1) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Lecture not found" } },
      { status: 404 }
    );
  }

  const prevLecture = currentIndex > 0 ? courseLectures[currentIndex - 1] : null;
  const nextLecture =
    currentIndex < courseLectures.length - 1
      ? courseLectures[currentIndex + 1]
      : null;

  return NextResponse.json({
    success: true,
    data: {
      lecture: courseLectures[currentIndex],
      course,
      prevLectureId: prevLecture ? (prevLecture.id || prevLecture._id) : null,
      nextLectureId: nextLecture ? (nextLecture.id || nextLecture._id) : null,
      allLectures: courseLectures,
    },
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; lectureId: string }> }
) {
  const { lectureId } = await params;
  const index = lecturesStore.findIndex((l) => l.id === lectureId || l._id === lectureId);

  if (index === -1) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Lecture not found" } },
      { status: 404 }
    );
  }

  const body = await req.json();
  lecturesStore[index] = {
    ...lecturesStore[index],
    title: body.title,
    description: body.description ?? lecturesStore[index].description,
    videoUrl: body.videoUrl,
    order: Number(body.order) || lecturesStore[index].order,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: { lecture: lecturesStore[index] },
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; lectureId: string }> }
) {
  const { id: courseId, lectureId } = await params;
  const index = lecturesStore.findIndex((l) => l.id === lectureId || l._id === lectureId);

  if (index === -1) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Lecture not found" } },
      { status: 404 }
    );
  }

  lecturesStore.splice(index, 1);

  const course = coursesStore.find((c) => c.id === courseId || c._id === courseId);
  if (course && (course.lectureCount || 0) > 0) {
    course.lectureCount = (course.lectureCount || 1) - 1;
  }

  return NextResponse.json({
    success: true,
    data: { deleted: true },
  });
}
