"use client";

import React, { useState, useCallback, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

const ImageUpload = () => {
  const [mounted, setMounted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [error, setError] = useState("");

  // Move all useCallback declarations before any conditional returns
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = useCallback(async (file) => {
    if (!file) return;

    // ファイルタイプの確認
    if (!file.type.startsWith("image/")) {
      setError("Only image files can be uploaded.");
      return;
    }

    // ファイルサイズの確認 (5MB制限)
    if (file.size > 5 * 1024 * 1024) {
      setError("Please keep the file size under 5MB.");
      return;
    }

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Upload for upload
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });

      // if (!response.ok) throw new Error('Upload failed');
      // const data = await response.json();
      // setUploadedImage(data.url);

      // Preview for loacal
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setError("");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("An error occurred during upload.");
      console.error("Upload error:", err);
    }
  }, []);

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

  const handleRemove = useCallback(() => {
    setUploadedImage("");
    setError("");
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {uploadedImage ? (
        <div className="relative rounded-lg overflow-hidden h-64">
          <Image
            src={uploadedImage}
            alt="Uploaded preview"
            fill
            className="object-cover"
            unoptimized={uploadedImage.startsWith("data:")}
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
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

          <UploadCloud className="mx-auto mb-4 text-gray-400 w-12 h-12" />
          <div className="text-gray-600">
            <p className="mb-1">Drag & drop images</p>
            <p className="text-sm">
              or, <span className="text-blue-500">click to select</span>
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Supported formats: JPG, PNG, GIF (up to 5MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
