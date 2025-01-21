import ImageInputOutputContainer from "@/components/imageInputOutput/imageInputOutputContainer";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DiaryViewer from "@/components/diaryViewer";
import type { DiaryEntry } from "@/types/diary";

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
    .select("*")
    .order("created_at", { ascending: false });

  console.log({ diaryEntries });

  if (fetchError) {
    console.error("Error fetching diary entries:", fetchError);
    // Handle error appropriately
  }

  return (
    <div className="p-4">
      <p>Hello, {user.email}!</p>
      <ImageInputOutputContainer />
      <DiaryViewer entries={diaryEntries as DiaryEntry[]} />
    </div>
  );
}
