import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DiaryViewer from "@/components/diary-viewer";
import type { DiaryEntry } from "@/types/diary";
import UploadJournal from "@/components/upload-journal";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch diary entries
  const { data: diaryEntries, error: fetchError } = await supabase
    .from("journal")
    .select("id, text_data, created_at")
    .order("created_at", { ascending: false });

  if (fetchError) {
    console.error("Error fetching diary entries:", fetchError);
  }

  return (
    <>
      <div className="p-4 items-center w-full max-w-screen-md mx-auto">
        <p className="p-4">Hello, {user.email}!</p>
        <DiaryViewer entries={diaryEntries as DiaryEntry[]} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="container mx-auto p-4">
          <UploadJournal />
        </div>
      </div>
    </>
  );
}
