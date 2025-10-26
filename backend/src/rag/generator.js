import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateWithContext(userQuery, contextChunks) {
  const context = contextChunks.map((c, i) => `[#${i+1}] ${c.text}`).join("\n\n");
  const sys =
    "You are a booking assistant. Use ONLY the provided CONTEXT for facts. " +
    "Show 2–3 options when relevant. Cite sources like [#1], [#2]. If unsure, ask clarifying questions.";
  const messages = [
    { role: "system", content: sys },
    { role: "user", content: `USER: ${userQuery}\n\nCONTEXT:\n${context}` }
  ];
  const resp = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.2,
    messages
  });
  return resp.choices[0].message.content;
}
