import { Schema, model, Document } from "mongoose";

export interface IExpense extends Document {
  title: string;
  amount: number;
  category: "Accommodation" | "Transport" | "Dining" | "Activities" | "Shopping" | "Misc";
  date: Date;
  location?: string;
  merchant?: string;
  receiptUrl?: string;
  confidenceScore: number;
  owner: string; // User ID from Better Auth
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Accommodation", "Transport", "Dining", "Activities", "Shopping", "Misc"]
    },
    date: { type: Date, default: Date.now },
    location: { type: String, trim: true },
    merchant: { type: String, trim: true },
    receiptUrl: { type: String },
    confidenceScore: { type: Number, default: 1.0 },
    owner: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export const Expense = model<IExpense>("Expense", ExpenseSchema);
