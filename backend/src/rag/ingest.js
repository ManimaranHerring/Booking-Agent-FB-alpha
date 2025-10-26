import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import { buildBM25Index, saveBM25 } from "./bm25.js";
import { saveVectorStore } from "./vectordb.js";
dotenv.config();

const KNOWLEDGE_DIR = process.env.KNOWLEDGE_DIR || "./data/knowledge_base";
const VECTOR_DIR    = process.env.VECTOR_DIR    || "./rag_store/vector";
const BM25_PATH     = process.env.BM25_PATH     || "./rag_store/bm25.json";

async function readFileText(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === ".txt" || ext === ".md") return fs.readFileSync(p, "utf8");
  if (ext === ".pdf") {
    const buf = fs.readFileSync(p);
    const parsed = await pdfParse(buf);
    return parsed.text || "";
  }
  return "";
}

function chunkText(text, max = 800) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += max) {
    chunks.push(words.slice(i, i + max).join(" "));
  }
  return chunks.filter(c => c.trim().length > 0);
}

async function main() {
  const files = fs.readdirSync(KNOWLEDGE_DIR, { withFileTypes: true })
                  .filter(d => d.isFile())
                  .map(d => path.join(KNOWLEDGE_DIR, d.name));

  const texts = [];
  const metas = [];
  for (const fp of files) {
    const raw = await readFileText(fp);
    const chunks = chunkText(raw, 800);
    for (const ch of chunks) {
      texts.push(ch);
      metas.push({ source: path.basename(fp) });
    }
  }
  if (!texts.length) {
    console.log("No documents found in", KNOWLEDGE_DIR);
    process.exit(0);
  }
  // Build & save vector index
  await saveVectorStore(texts, metas, VECTOR_DIR);
  // Build & save BM25
  const bmDocs = texts.map((t, i) => ({ id: i, text: t, meta: metas[i] }));
  const bm = buildBM25Index(bmDocs);
  saveBM25(bm, BM25_PATH);

  console.log(`Ingested ${texts.length} chunks from ${files.length} file(s).`);
}
main();
