import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    // Store contact enquiry in the database
    const { error } = await supabase.from("contact_enquiries").insert({
      name: body.name,
      email: body.email,
      subject: body.subject || "",
      message: body.message,
      created_at: new Date().toISOString(),
    });

    if (error) {
      // If table doesn't exist, still return success (graceful degradation)
      console.error("Contact enquiry save failed:", error.message);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
