"use client";

import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => Promise<void>;
}

export function UploadDialog({
  open,
  onOpenChange,
  onUpload,
}: UploadDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        await onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    disabled: isUploading,
    maxFiles: 1,
  });

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
    console.log({ file });
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
      setIsUploading(true);
      // Create FormData
      const formData = new FormData(); //
      formData.append("image", file);

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setIsUploading(false);
      setUploadedImage(data.url);

      // Preview for loacal
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setError("");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploading(false);
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
      console.log("e", e);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Journal</DialogTitle>
        </DialogHeader>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
