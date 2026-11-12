import { NextResponse } from "next/server";
import { coursesStore, lecturesStore } from "../../_data/store";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const course = coursesStore.find((c) => c.id === id || c._id === id);

  if (!course) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Course not found" } },
      { status: 404 }
    );
  }

  const lectures = lecturesStore.filter((l) => l.courseId === (course.id || course._id));

  return NextResponse.json({
    success: true,
    data: {
      course: { ...course, lectureCount: lectures.length },
      lectures,
    },
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = coursesStore.findIndex((c) => c.id === id || c._id === id);

  if (index === -1) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Course not found" } },
      { status: 404 }
    );
  }

  const body = await req.json();
  coursesStore[index] = {
    ...coursesStore[index],
    title: body.title,
    description: body.description,
    price: Number(body.price),
    thumbnailUrl: body.thumbnailUrl ?? coursesStore[index].thumbnailUrl,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: { course: coursesStore[index] },
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = coursesStore.findIndex((c) => c.id === id || c._id === id);

  if (index === -1) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Course not found" } },
      { status: 404 }
    );
  }

  // Cascade delete lectures
  const targetId = coursesStore[index].id || coursesStore[index]._id;
  coursesStore.splice(index, 1);
  for (let i = lecturesStore.length - 1; i >= 0; i--) {
    if (lecturesStore[i].courseId === targetId) {
      lecturesStore.splice(i, 1);
    }
  }

  return NextResponse.json({
    success: true,
    data: { deleted: true },
  });
}
