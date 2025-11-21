"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Upload({ uploadedImages, setUploadedImages }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (uploadedImages.length >= 8) {
      alert("You already uploaded 8 images.");
      return;
    }

    setUploading(true);

    // Unique filename
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()}.${ext}`;

    const { error } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    if (error) {
      alert("Upload failed!");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName);

    setUploadedImages((prev) => [...prev, data.publicUrl]);

    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
        {uploading ? "Uploading..." : "Upload Image"}
        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
      </label>

      <p className="text-white text-sm">
        Uploaded: {uploadedImages.length} / 8
      </p>

      {/* PREVIEW */}
      <div className="grid grid-cols-4 gap-2 mt-2">
        {uploadedImages.map((url, i) => (
          <img key={i} src={url} className="w-16 h-16 rounded object-cover border" />
        ))}
      </div>
    </div>
  );
}
