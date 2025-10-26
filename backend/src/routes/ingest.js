import express from "express";
import { spawn } from "child_process";
const router = express.Router();

router.post("/", async (_req, res) => {
  const p = spawn(process.execPath, ["./src/rag/ingest.js"], { cwd: process.cwd() });
  p.stdout.on("data", d => process.stdout.write(d));
  p.stderr.on("data", d => process.stderr.write(d));
  p.on("close", code => console.log("Ingest finished with code", code));
  res.json({ started: true });
});

export default router;
