"use client";

import { useCallback, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [editedText, setEditedText] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [journalId, setJournalId] = useState(null);

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
        setEditedText(data.result); // Set initial value for editing
        setJournalId(data.savedData.id);
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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/analyze-image", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: editedText,
          journalId: journalId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      router.push("/");
    } catch (error) {
      console.error("Error saving:", error);
      setError("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/analyze-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          journalId: journalId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      router.push("/");
    } catch (error) {
      console.error("Error saving:", error);
      setError("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };
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
        {extractedText && (
          <div className="space-y-4">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full min-h-[200px] p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Edit your journal entry..."
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
