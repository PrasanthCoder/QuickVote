import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const { title, options } = await request.json();

    if (!title || !options) {
      return NextResponse.json(
        { error: "Title and options are required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";

    const prompt = `Given the following poll title and options, suggest a single category that best describes the poll. Return only the category name as plain text (e.g., Entertainment, Technology, Food, Sports). Do not include explanations or extra text.

    Title: "${title}"
    Options: ${JSON.stringify(options)}

    Suggested Category:`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const category =
      response?.text?.trim().replace(/^"|"$/g, "") || "Uncategorized";

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error categorizing poll:", error);
    return NextResponse.json(
      { error: "Failed to categorize poll" },
      { status: 500 },
    );
  }
}
