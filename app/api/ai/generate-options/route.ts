import { GoogleGenAI } from "@google/genai";

export const runtime = "edge"; // For Edge function support

export async function POST(request: Request) {
  const { question, usedOptions = [] } = await request.json();

  try {
    const api_key: string = process.env.GOOGLE_AI_API_KEY!;
    const ai = new GoogleGenAI({ apiKey: api_key });
    const model = "gemini-2.5-flash";

    const exclusionText =
      usedOptions.length > 0
        ? `Exclude these options: ${usedOptions.join(", ")}.`
        : "";
    const prompt = `Generate 4-6 concise, diverse poll options for the question: "${question}". ${exclusionText}
    Return only a JSON array of options like ["Option 1", "Option 2"]. Do not include any explanations.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    const text = response.text ? response.text : "";

    // Clean the response (Gemini sometimes adds markdown)
    const cleanText = text.replace(/```json|```/g, "").trim();
    const options = JSON.parse(cleanText);

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
