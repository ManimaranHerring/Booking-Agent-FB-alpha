import express from "express";
import { hybridRetrieve } from "../rag/retriever.js";
import { generateWithContext } from "../rag/generator.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { session_id, message } = req.body;
    const ctx = await hybridRetrieve(message, 6, 6, 5);
    const answer = await generateWithContext(message, ctx);
    return res.json({
      answer,
      citations: ctx.map(c => ({ source: c.source, text: c.text.slice(0, 160) }))
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
