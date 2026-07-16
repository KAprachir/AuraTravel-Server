import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("⚠️ GEMINI_API_KEY is not defined. Running AI features in Simulation Mode.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface IParsedReceipt {
  title: string;
  merchant: string;
  amount: number;
  category: "Accommodation" | "Transport" | "Dining" | "Activities" | "Shopping" | "Misc";
  date: string; // YYYY-MM-DD
  location: string;
  confidenceScore: number;
}

/**
 * Parses receipt document contents (image, PDF, or text) into a structured expense JSON object.
 */
export const parseReceipt = async (
  fileBuffer: Buffer,
  mimeType: string,
  fileName: string = "receipt.jpg"
): Promise<IParsedReceipt> => {
  if (!genAI) {
    console.log("🤖 Simulation Mode: Generating high-fidelity mock parsed receipt.");
    // Wait 1.5s to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Seed mock data depending on file name keywords
    const lowerName = fileName.toLowerCase();
    let title = "Travel Expense";
    let merchant = "Local Vendor";
    let amount = 45.5;
    let category: IParsedReceipt["category"] = "Misc";
    let location = "San Francisco, CA";

    if (lowerName.includes("hotel") || lowerName.includes("room") || lowerName.includes("stay")) {
      title = "Hotel Lodging Stay";
      merchant = "Hilton Gardens";
      amount = 185.0;
      category = "Accommodation";
    } else if (lowerName.includes("flight") || lowerName.includes("uber") || lowerName.includes("taxi") || lowerName.includes("ticket")) {
      title = "Airline Flight Ticket";
      merchant = "United Airlines";
      amount = 350.0;
      category = "Transport";
    } else if (lowerName.includes("food") || lowerName.includes("restaurant") || lowerName.includes("coffee") || lowerName.includes("dinner")) {
      title = "Dining & Beverages";
      merchant = "Le Paris Café";
      amount = 62.4;
      category = "Dining";
    } else if (lowerName.includes("museum") || lowerName.includes("tour") || lowerName.includes("park")) {
      title = "Museum Tour Ticket";
      merchant = "Louvre Palace Museum";
      amount = 28.0;
      category = "Activities";
    }

    return {
      title,
      merchant,
      amount,
      category,
      date: new Date().toISOString().split("T")[0],
      location,
      confidenceScore: 0.94
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare image/file parameter
    const filePart = {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType
      }
    };

    const prompt = `
Analyze this travel receipt, ticket, invoice, or booking document.
Extract the transaction details and return ONLY a valid JSON object matching this schema:
{
  "title": "A short descriptive title for the expense (e.g. Flight to Tokyo, Rome Hotel, Lunch in Gion)",
  "merchant": "Name of the business, airline, hotel, or merchant",
  "amount": number (total amount spent as a float, e.g. 150.50),
  "category": "Accommodation" | "Transport" | "Dining" | "Activities" | "Shopping" | "Misc",
  "date": "Transaction date in YYYY-MM-DD format",
  "location": "City and/or country of the transaction (or empty string if unknown)",
  "confidenceScore": number (a float between 0.0 and 1.0 representing your parsing confidence)
}

Do not include any markdown tags (like \`\`\`json) or explanation text. Just return the raw JSON object.
`;

    const result = await model.generateContent([filePart, prompt]);
    const response = await result.response;
    const responseText = response.text();

    // Clean up response if Gemini wrapped it in markdown code blocks
    let cleanText = responseText.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText
        .replace(/^```json\s*/i, "")
        .replace(/```$/, "")
        .trim();
    }

    const parsedData = JSON.parse(cleanText) as IParsedReceipt;
    return parsedData;
  } catch (error) {
    console.error("Gemini OCR parsing error:", error);
    throw new Error("AI engine failed to parse the receipt document.");
  }
};

/**
 * Generates a context-aware chat response for the Travel Copilot.
 */
export const generateChatResponse = async (
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  userMessage: string,
  contextText: string
): Promise<string> => {
  if (!genAI) {
    console.log("🤖 Simulation Mode: Generating mock copilot response.");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("hi") || lowerMessage.includes("hello")) {
      return "Hello! I am your AuraTravel Copilot. (Simulation Mode) I have access to your travel itineraries and expense charts. How can I help you plan your next journey today?";
    }
    if (lowerMessage.includes("expense") || lowerMessage.includes("spend") || lowerMessage.includes("cost")) {
      return "Based on your logged travel expenses, your largest expenditure is on Accommodation. If you want to cut costs, I suggest exploring budget hostels or beach homestays on our Explore page!";
    }
    if (lowerMessage.includes("kyoto") || lowerMessage.includes("japan")) {
      return "I see you have the 'Kyoto Temple & Tea Pilgrimage' saved! I recommend spending Day 2 exploring the beautiful Fushimi Inari gates at sunset, and stopping by Gion for historical townhouses.";
    }
    return `I received your message: "${userMessage}". In simulation mode, I can tell you that I've successfully loaded your user profile and current itineraries context! Ask me about Kyoto or your expenses to see simulated insights.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
You are the "AuraTravel Copilot", a premium AI travel assistant integrated into a travel suite application.
Your goal is to assist the user with travel planning, itinerary questions, budget calculations, and navigating the app.

Below is the user's active travel dashboard context (their user details, itineraries, and expenses):
---
${contextText}
---

Guidelines:
1. Be polite, friendly, and travel-expert minded.
2. Rely on the provided context to answer questions about their trips and budget.
3. If they ask about their expenses, summarize their numbers.
4. Keep your answers concise, structured (using markdown bullet points if helpful), and engaging.
5. Provide actionable suggestions based on their itineraries.
`;

    // Format chat session history
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }]
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am now initialized as the AuraTravel Copilot with user context." }]
        },
        ...history.slice(-10) // keep last 10 exchanges for memory
      ]
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Chat error:", error);
    return "I apologize, but I am having trouble connecting to my cognitive engine right now. Please try again in a moment.";
  }
};
