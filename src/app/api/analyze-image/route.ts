import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import encodeImage from "@/utils/encodeImage";
import { createClient } from "@/utils/supabase/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    console.log({ formData });
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const base64Image = await encodeImage(image);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the text from the attached file.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    const extractedText = response.choices[0].message.content;

    // Store in database with user_id
    const { data: savedData, error: dbError } = await supabase
      .from("journal")
      .insert([
        {
          text_data: extractedText,
          user_id: user.id, // Add this line
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: extractedText,
      savedData,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Error processing image" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { journalId } = body;

    if (!journalId) {
      return NextResponse.json(
        { error: "Text and journal ID are required" },
        { status: 400 }
      );
    }

    const { data: updatedData, error: dbError } = await supabase
      .from("journal")
      .delete()
      .eq("id", journalId)
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to update journal" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating journal:", error);
    return NextResponse.json(
      { error: "Error updating journal" },
      { status: 500 }
    );
  }
}
