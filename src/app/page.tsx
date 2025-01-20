import ImageInputOutputContainer from "@/components/imageInputOutput/imageInputOutputContainer";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <div className="p-4">
      <p>Hello, login user!</p>
      <ImageInputOutputContainer />
    </div>
  );
}
