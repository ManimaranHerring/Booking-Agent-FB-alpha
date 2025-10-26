import fs from "fs";
import winkBM25 from "wink-bm25-text-search";
import its from "wink-nlp-utils"; // built-in tokenizer from wink

export function buildBM25Index(docs) {
  const bm25 = winkBM25();
  bm25.defineConfig({ fldWeights: { text: 1 }});
  bm25.definePrepTasks([
    its.string.lowerCase,
    its.string.removeExtraSpaces,
    its.tokens.removePunctuations,
    its.tokens.stem
  ]);
  bm25.defineDocument((doc) => doc, (doc) => doc.id);
  docs.forEach((d, i) => bm25.addDoc({ id: String(i), text: d.text }));
  bm25.consolidate();
  return bm25;
}

export function saveBM25(bm25, path) {
  fs.mkdirSync(require("path").dirname(path), { recursive: true });
  fs.writeFileSync(path, JSON.stringify(bm25.exportJSON()));
}

export function loadBM25(path) {
  const bm25 = winkBM25();
  bm25.importJSON(JSON.parse(fs.readFileSync(path, "utf8")));
  return bm25;
}
