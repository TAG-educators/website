import { NextRequest, NextResponse } from "next/server";
import { createRegistration } from "@/lib/registrations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.studentName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields: studentName, email, phone" },
        { status: 400 }
      );
    }

    const { data, error } = await createRegistration({
      studentName: body.studentName,
      parentName: body.parentName || "",
      email: body.email,
      phone: body.phone,
      location: body.location || "",
      parentPhone: body.parentPhone || "",
      courses: body.courses || [],
      status: "new",
    });

    if (error) {
      return NextResponse.json({ error: "Failed to submit registration" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
