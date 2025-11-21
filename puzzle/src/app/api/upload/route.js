import { put } from "@vercel/blob";   // ✅ FIXED
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });

  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}
