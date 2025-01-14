import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

export async function POST() {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What's in this image?" },
          {
            type: "image_url",
            image_url: {
              url: "https://www.font-station.com/wp-content/uploads/2024/01/1-1-handwritten-note-taking-font-neat-digital-notes-font-main-square.jpg",
            },
          },
        ],
      },
    ],
  });

  console.log(response.choices[0]);

  return NextResponse.json({ result: response.choices[0] });
}
