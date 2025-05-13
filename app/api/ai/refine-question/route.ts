import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { message: "Invalid question input" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY!;
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.0-flash";

    const prompt = `Improve and refine the following poll question for clarity and conciseness: "${question}". 
Return only the refined question as plain text. Do not include any explanations or extra text.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text || "";
    const refined = text.trim().replace(/^"|"$/g, ""); // Remove surrounding quotes if present

    return NextResponse.json({ refined });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ message: "AI request failed" }, { status: 500 });
  }
}
