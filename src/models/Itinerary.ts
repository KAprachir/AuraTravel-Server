import { Schema, model, Document } from "mongoose";

export interface IDailyActivity {
  day: number;
  title: string;
  activities: string[];
}

export interface IItinerary extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  destination: string;
  duration: number; // in days
  cost: number; // budget amount
  rating: number;
  category: "Adventure" | "Beach" | "Cultural" | "Wellness" | "Food" | "Family";
  startDate?: Date;
  isPublic: boolean;
  status: "pending_approval" | "approved" | "rejected";
  creator: string; // User ID or email from Better Auth
  creatorName?: string;
  creatorBio?: string;
  creatorAvatar?: string;
  creatorExperience?: number;
  dailyPlan: IDailyActivity[];
  createdAt: Date;
  updatedAt: Date;
}

const DailyActivitySchema = new Schema<IDailyActivity>({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  activities: [{ type: String, required: true }]
});

const ItinerarySchema = new Schema<IItinerary>(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    coverImage: { type: String, required: true },
    destination: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1 },
    cost: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    category: {
      type: String,
      required: true,
      enum: ["Adventure", "Beach", "Cultural", "Wellness", "Food", "Family"]
    },
    startDate: { type: Date },
    isPublic: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["pending_approval", "approved", "rejected"],
      default: "approved"
    },
    creator: { type: String, required: true },
    creatorName: { type: String, default: "AuraTravel Planner" },
    creatorBio: { type: String, default: "Professional Travel Curator" },
    creatorAvatar: { type: String },
    creatorExperience: { type: Number, default: 5 },
    dailyPlan: [DailyActivitySchema]
  },
  {
    timestamps: true
  }
);

// Add index for text search
ItinerarySchema.index({ title: "text", destination: "text", shortDescription: "text" });

export const Itinerary = model<IItinerary>("Itinerary", ItinerarySchema);
