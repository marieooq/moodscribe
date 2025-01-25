import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get journalId from URL search params
      const journalId = req.nextUrl.searchParams.get("id");
      console.log({ journalId });

    if (!journalId) {
      return NextResponse.json(
        { error: "Journal ID is required" },
        { status: 400 }
      );
    }

    const { data: selectedData, error: dbError } = await supabase
      .from("journal")
      .select("*")
      .eq("id", journalId)
      .eq("user_id", user.id)
      .single();  // Add this to get a single record

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to update journal" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: selectedData,
    });
  } catch (error) {
    console.error("Error fetching a journal:", error);
    return NextResponse.json(
      { error: "Error fetching a journal" },
      { status: 500 }
    );
  }
}
