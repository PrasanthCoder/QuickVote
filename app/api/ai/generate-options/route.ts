import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const { question, usedOptions = [] } = await request.json();

    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "Invalid question input" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const exclusionText =
      usedOptions.length > 0
        ? `Exclude these options: ${usedOptions.join(", ")}.`
        : "";

    const prompt = `Generate 4–6 concise, diverse poll options for the question below.

Return ONLY a JSON array of strings.
Do NOT include explanations, markdown, or extra text.

Question: "${question}"
${exclusionText}

Options JSON array:`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const rawText =
      completion.choices[0]?.message?.content
        ?.trim()
        .replace(/^```json\s*|^```\s*|```$/g, "") ?? "[]";

    let options: string[] = [];
    try {
      options = JSON.parse(rawText);
    } catch {
      console.error("Failed to parse options JSON:", rawText);
      options = [];
    }

    return new Response(JSON.stringify({ options }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate options" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
