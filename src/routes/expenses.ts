import { Router } from "express";
import { Expense } from "../models/Expense.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { parseReceipt } from "../services/ai.js";

const router = Router();

// GET all user expenses (Protected)
router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const expenses = await Expense.find({ owner: userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// POST save a parsed or manually created expense (Protected)
router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { title, amount, category, date, location, merchant, confidenceScore } = req.body;

    if (!title || amount === undefined || !category) {
      return res.status(400).json({ error: "Title, amount, and category are required." });
    }

    const newExpense = new Expense({
      title,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date(),
      location,
      merchant,
      confidenceScore: confidenceScore !== undefined ? Number(confidenceScore) : 1.0,
      owner: req.user?.id
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Error saving expense:", error);
    res.status(500).json({ error: "Failed to save expense" });
  }
});

// POST upload/parse receipt (Protected)
router.post("/upload", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { file, mimeType, fileName } = req.body;

    if (!file || !mimeType) {
      return res.status(400).json({ error: "File base64 data and mimeType are required." });
    }

    const fileBuffer = Buffer.from(file, "base64");
    const parsedData = await parseReceipt(fileBuffer, mimeType, fileName);

    res.json(parsedData);
  } catch (error) {
    console.error("Error parsing receipt:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to parse receipt"
    });
  }
});

export default router;
