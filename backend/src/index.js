import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import chatRouter from "./routes/chat.js";
import bookingRouter from "./routes/booking.js";
import ingestRouter from "./routes/ingest.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

export const prisma = new PrismaClient();

app.use("/api/chat", chatRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/ingest", ingestRouter); // optional HTTP reingest

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
