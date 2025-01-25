"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = useCallback(
    async (file) => {
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Only image files can be uploaded.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Please keep the file size under 5MB.");
        return;
      }

      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/analyze-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();

        console.log({ data });

        setExtractedText(data.result);
        setIsUploading(false);

        // Redirect to home page after successful upload
        //   router.push('/');
      } catch (err) {
        setIsUploading(false);
        setError("An error occurred during upload.");
        console.error("Upload error:", err);
      }
    },
    [router]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      processFile(file);
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      processFile(file);
    },
    [processFile]
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Upload Journal</h1>
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center
            ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            transition-colors cursor-pointer`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="image-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleChange}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Uploading...</p>
            </div>
          ) : dragActive ? (
            <p>Drop your journal image here...</p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8" />
              <p>Drag & drop your journal image here, or click to select</p>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {extractedText && <pre className="text-wrap">{extractedText}</pre>}
      </div>
    </div>
  );
}
