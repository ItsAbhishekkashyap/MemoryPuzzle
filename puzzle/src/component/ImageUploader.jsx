"use client";

import { useState } from "react";

export default function ImageUploader({ onComplete }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (files.length > 8) {
      setError("You can upload a maximum of 8 images.");
      return;
    } else setError("");

    setUploading(true);
    const uploadedUrls = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await res.json();
        if (json.url) uploadedUrls.push(json.url);
      } catch (err) {
        console.error("Upload failed:", err);
        setError("Upload failed. Try again.");
      }
    }

    setUploading(false);
    if (uploadedUrls.length) onComplete(uploadedUrls);
  };

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleUpload} className="p-2 border rounded" />
      {uploading && <p className="text-gray-300 mt-2">Uploading images...</p>}
      {error && <p className="text-red-400 mt-2">{error}</p>}
      <p className="text-gray-400 text-sm mt-1">Upload exactly 8 images for a full custom game.</p>
    </div>
  );
}
