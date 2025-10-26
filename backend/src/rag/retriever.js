import { loadVectorStore } from "./vectordb.js";
import { loadBM25 } from "./bm25.js";
import dotenv from "dotenv";
dotenv.config();

const VECTOR_DIR = process.env.VECTOR_DIR || "./rag_store/vector";
const BM25_PATH  = process.env.BM25_PATH  || "./rag_store/bm25.json";

let _vstore = null;
let _bm25   = null;

export async function ensureStores() {
  if (!_vstore) _vstore = await loadVectorStore(VECTOR_DIR);
  if (!_bm25)   _bm25   = loadBM25(BM25_PATH);
}

export async function hybridRetrieve(query, kVec = 6, kLex = 6, finalK = 5) {
  await ensureStores();
  // 1) vector candidates
  const vdocs = await _vstore.similaritySearch(query, kVec);
  const vecCandidates = vdocs.map(d => ({ text: d.pageContent, meta: d.metadata, score: 1 }));
  // 2) bm25 candidates
  const hits = _bm25.search(query).slice(0, kLex);
  const bmCandidates = hits.map(h => ({ text: h.body.text, meta: h.body.meta ?? {}, score: h.score }));
  // 3) merge + dedupe by text
  const merged = [...vecCandidates, ...bmCandidates];
  const seen = new Set(); const uniq = [];
  for (const c of merged) if (!seen.has(c.text)) { seen.add(c.text); uniq.push(c); }
  // 4) light rerank: cosine via embeddings centroid is heavy; use bm25 score + vector presence
  uniq.sort((a, b) => (b.score || 0) - (a.score || 0));
  return uniq.slice(0, finalK).map((u, i) => ({ id: i+1, text: u.text, ...u.meta }));
}
