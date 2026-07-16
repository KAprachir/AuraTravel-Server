import { Router } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { Itinerary } from "../models/Itinerary.js";
import { Expense } from "../models/Expense.js";
import { generateChatResponse } from "../services/ai.js";

const router = Router();

router.post("/chat", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const userId = req.user?.id;
    const userName = req.user?.name || "Traveler";

    // 1. Fetch user data context
    const itineraries = await Itinerary.find({ creator: userId });
    const expenses = await Expense.find({ owner: userId });

    // 2. Format context text for Gemini System instructions
    let contextText = `User Profile:\n- Name: ${userName}\n\n`;

    contextText += `Saved Itineraries (${itineraries.length}):\n`;
    if (itineraries.length > 0) {
      itineraries.forEach((it, idx) => {
        contextText += `${idx + 1}. "${it.title}" in ${it.destination}\n`;
        contextText += `   - Duration: ${it.duration} days | Cost: $${it.cost} | Category: ${it.category}\n`;
        if (it.dailyPlan && it.dailyPlan.length > 0) {
          contextText += `   - Daily Schedule Outline:\n`;
          it.dailyPlan.forEach((day) => {
            contextText += `     * Day ${day.day}: ${day.title} (${day.activities.join(", ")})\n`;
          });
        }
      });
    } else {
      contextText += `No itineraries created yet.\n`;
    }

    contextText += `\nLogged Expenses (${expenses.length}):\n`;
    if (expenses.length > 0) {
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      contextText += `- Total Budget Spent: $${total.toLocaleString()}\n`;
      expenses.forEach((e) => {
        contextText += `- [${e.category}] ${e.title} at ${e.merchant || "Vendor"} - $${e.amount} on ${e.date.toISOString().split("T")[0]}\n`;
      });
    } else {
      contextText += `No expenses logged yet.\n`;
    }

    // 3. Call AI Service
    const aiResponse = await generateChatResponse(history || [], message, contextText);

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("AI Chat Route Error:", error);
    res.status(500).json({ error: "Failed to generate AI response." });
  }
});

export default router;
