import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  const { session_id, type, amount, details } = req.body;
  const b = await prisma.booking.create({
    data: { sessionId: session_id ?? 1, type, amount: Number(amount || 0), details }
  });
  res.json({ id: b.id, status: b.status });
});

export default router;
