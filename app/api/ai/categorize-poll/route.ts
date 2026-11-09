import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    console.log("going in api category");
    const { title, options } = await request.json();

    if (!title || !options) {
      return NextResponse.json(
        { error: "Title and options are required" },
        { status: 400 },
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const prompt = `Given the following poll title and options, suggest a single category that best describes the poll.

Return ONLY the category name as plain text.
Do NOT include explanations.

Examples: Entertainment, Technology, Food, Sports

Title: "${title}"
Options: ${JSON.stringify(options)}

Category:`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    });

    console.log(completion);

    const category =
      completion.choices[0]?.message?.content?.trim().replace(/^"|"$/g, "") ||
      "Uncategorized";

    console.log(category);

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error categorizing poll:", error);
    return NextResponse.json(
      { error: "Failed to categorize poll" },
      { status: 500 },
    );
  }
}
