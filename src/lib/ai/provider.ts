import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.AI_BASE_URL ?? "https://api.openai.com/v1",
  apiKey: process.env.AI_API_KEY ?? "",
});

export async function runAIChat(prompt: string, jsonMode = true): Promise<string> {
  const response = await client.chat.completions.create({
    model: process.env.AI_MODEL ?? "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert video content analyst. You return ONLY valid JSON, no markdown, no explanation.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 4096,
    ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
  });

  return response.choices[0]?.message?.content ?? "";
}
