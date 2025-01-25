"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function EditJournalContent({ id }: { id: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [editedText, setEditedText] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchJournal = async () => {
      const { data: selectedData, error: dbError } = await supabase
        .from("journal")
        .select("id, text_data, created_at")
        .match({
          id,
        })
        .single();
      console.log({ selectedData });
      setEditedText(selectedData?.text_data);
    };

    fetchJournal();
  }, [supabase, id]);

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
          journalId: id, // Now using unwrapped id
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
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold mb-6">Edit Journal</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full min-h-[400px] p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Edit your journal entry..."
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <EditJournalContent id={id} />;
}
