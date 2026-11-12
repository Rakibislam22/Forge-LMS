import { NextResponse } from "next/server";
import { coursesStore } from "../_data/store";

export async function GET() {
  const backendUrl = process.env.BACKEND_API_URL || process.env.INTERNAL_API_URL;

  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/courses`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn("Backend forwarding failed, falling back to seed data:", err);
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      courses: coursesStore,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newCourse = {
      id: "6732dc01f1a2b3c4d5e6f" + Math.floor(100 + Math.random() * 900),
      title: body.title,
      description: body.description,
      price: Number(body.price),
      thumbnailUrl: body.thumbnailUrl || "",
      lectureCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    coursesStore.unshift(newCourse);

    return NextResponse.json(
      {
        success: true,
        data: { course: newCourse },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid input" } },
      { status: 400 }
    );
  }
}
