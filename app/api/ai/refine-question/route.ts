import { NextRequest, NextResponse } from "next/server";
import Cerebras from "@cerebras/cerebras_cloud_sdk";

/**
 * Minimal Cerebras response shape
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

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { message: "Invalid question input" },
        { status: 400 },
      );
    }

    const apiKey = process.env.CEREBRAS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "API key not configured" },
        { status: 500 },
      );
    }

    const client = new Cerebras({ apiKey });

    const prompt = `Improve and refine the following poll question for clarity and conciseness. the refined one should not add extra context.

Return ONLY the refined question as plain text.
Do NOT include explanations or extra text.

Question: "${question}"

Refined question:`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 50,
    });

    // Narrow unknown → known shape
    const completion = response as CerebrasChatCompletion;

    const refined =
      completion.choices[0]?.message?.content?.trim().replace(/^"|"$/g, "") ||
      question;

    return NextResponse.json({ refined });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ message: "AI request failed" }, { status: 500 });
  }
}
