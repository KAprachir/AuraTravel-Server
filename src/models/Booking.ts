import { Schema, model, Document } from "mongoose";

export interface IBooking extends Document {
  itineraryId: Schema.Types.ObjectId;
  travelerId: string;
  plannerId: string;
  price: number;
  numberOfTravelers: number;
  totalPrice: number;
  startDate: Date;
  status: "booked" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    itineraryId: { type: Schema.Types.ObjectId, ref: "Itinerary", required: true },
    travelerId: { type: String, required: true },
    plannerId: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    numberOfTravelers: { type: Number, required: true, default: 1, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ["booked", "cancelled"],
      default: "booked"
    }
  },
  {
    timestamps: true
  }
);

export const Booking = model<IBooking>("Booking", BookingSchema);
