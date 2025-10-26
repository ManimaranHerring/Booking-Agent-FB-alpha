import fs from "fs";
import path from "path";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";
dotenv.config();

export async function saveVectorStore(texts, metadatas, dir) {
  const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
  const docs = texts.map((t, i) => ({ pageContent: t, metadata: metadatas[i] }));
  const store = await HNSWLib.fromDocuments(docs, embeddings);
  fs.mkdirSync(dir, { recursive: true });
  await store.save(dir);
}

export async function loadVectorStore(dir) {
  const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
  if (!fs.existsSync(path.join(dir, "docstore.json"))) throw new Error("Vector store missing—run ingest.");
  return await HNSWLib.load(dir, embeddings);
}
