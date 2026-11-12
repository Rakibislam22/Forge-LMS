import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Default assessment admin credential
    const validEmail = process.env.ADMIN_EMAIL || "admin@forgelms.local";
    const validPassword = process.env.ADMIN_PASSWORD || "Admin1234!";

    if (
      (email === validEmail && password === validPassword) ||
      (email === "admin@example.com" && password === "password")
    ) {
      return NextResponse.json({
        success: true,
        data: {
          token: "forge_mock_jwt_token_" + Buffer.from(email).toString("base64"),
          admin: {
            id: "6732dc00f1a2b3c4d5e6f001",
            email,
            role: "admin",
          },
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Incorrect email or password. Try again.",
        },
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid login payload",
        },
      },
      { status: 400 }
    );
  }
}
