import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { message: "Invalid question input" },
        { status: 400 },
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { message: "API key not configured" },
        { status: 500 },
      );
    }

    const prompt = `Improve and refine the following poll question for clarity and conciseness. the refined one should not add extra context.

Return ONLY the refined question as plain text.
Do NOT include explanations or extra text.

Question: "${question}"

Refined question:`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 500,
    });

    const refined =
      completion.choices[0]?.message?.content?.trim().replace(/^"|"$/g, "") ||
      question;

    return NextResponse.json({ refined });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ message: "AI request failed" }, { status: 500 });
  }
}
