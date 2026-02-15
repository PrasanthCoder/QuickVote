import { NextResponse } from "next/server";
import Cerebras from "@cerebras/cerebras_cloud_sdk";

/**
 * Minimal response shape returned by Cerebras chat completions
 * (SDK returns `unknown`, so we safely narrow it)
 */
interface CerebrasChatCompletion {
  choices: Array<{
    message: {
      role: "assistant" | "user" | "system";
      content: string;
    };
  }>;
}

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

    const apiKey = process.env.CEREBRAS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const client = new Cerebras({ apiKey });

    const prompt = `Given the following poll title and options, suggest a single category that best describes the poll.

Return ONLY the category name as plain text.
Do NOT include explanations.

Examples: Entertainment, Technology, Food, Sports

Title: "${title}"
Options: ${JSON.stringify(options)}

Category:`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 10,
    });

    console.log(response);

    // Narrow unknown → known shape
    const completion = response as CerebrasChatCompletion;

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
