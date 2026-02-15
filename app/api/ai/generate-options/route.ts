import Cerebras from "@cerebras/cerebras_cloud_sdk";

export const runtime = "edge"; // Keep Edge support as requested

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

export async function POST(request: Request) {
  try {
    const { question, usedOptions = [] } = await request.json();

    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "Invalid question input" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.CEREBRAS_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new Cerebras({ apiKey });

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

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    // Narrow unknown → known shape
    const completion = response as CerebrasChatCompletion;

    const rawText = completion.choices[0]?.message?.content?.trim() ?? "[]";

    // Parse JSON safely
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
