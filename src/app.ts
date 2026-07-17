import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.js";
import itinerariesRouter from "./routes/itineraries.js";
import expensesRouter from "./routes/expenses.js";
import aiRouter from "./routes/ai.js";

dotenv.config();

const app = express();
app.set("trust proxy", true);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.all("/api/auth/*", toNodeHandler(auth));
app.use("/api/itineraries", itinerariesRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/ai", aiRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to AuraTravel API" });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
