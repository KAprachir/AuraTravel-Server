import { Router } from "express";
import { Booking } from "../models/Booking.js";
import { Itinerary } from "../models/Itinerary.js";
import { db } from "../config/auth.js";
import { requireAuth, requireRole, AuthenticatedRequest } from "../middleware/auth.js";

const bookingsRouter = Router();

// Create new booking
bookingsRouter.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { itineraryId, numberOfTravelers, startDate } = req.body;
    if (!itineraryId || !numberOfTravelers || !startDate) {
      return res.status(400).json({ error: "Missing required booking details." });
    }

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found." });
    }

    const price = itinerary.cost;
    const travelersCount = Number(numberOfTravelers);
    const totalPrice = price * travelersCount;

    const newBooking = new Booking({
      itineraryId,
      travelerId: req.user?.id,
      plannerId: itinerary.creator,
      price,
      numberOfTravelers: travelersCount,
      totalPrice,
      startDate: new Date(startDate),
      status: "booked"
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to process booking transaction." });
  }
});

// Get current traveler's bookings
bookingsRouter.get("/my", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const bookings = await Booking.find({ travelerId: req.user?.id })
      .populate("itineraryId")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching traveler bookings:", error);
    res.status(500).json({ error: "Failed to fetch your bookings." });
  }
});

// Get current planner's sales
bookingsRouter.get("/sales", requireAuth, requireRole(["planner", "admin"]), async (req: AuthenticatedRequest, res) => {
  try {
    const plannerId = req.user?.id;
    const bookings = await Booking.find({ plannerId })
      .populate("itineraryId")
      .sort({ createdAt: -1 });

    // Aggregate stats
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const avgOrderValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    res.json({
      bookings,
      stats: {
        totalBookings,
        totalRevenue,
        avgOrderValue
      }
    });
  } catch (error) {
    console.error("Error fetching planner sales:", error);
    res.status(500).json({ error: "Failed to fetch sales statistics." });
  }
});

// Get all platform bookings (Admin only)
bookingsRouter.get("/all", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("itineraryId")
      .sort({ createdAt: -1 });

    // Fetch user details from MongoDB user collection
    const travelerIds = Array.from(new Set(bookings.map((b) => b.travelerId)));
    const plannerIds = Array.from(new Set(bookings.map((b) => b.plannerId)));
    const allUserIds = Array.from(new Set([...travelerIds, ...plannerIds]));

    const users = await db.collection("user").find({ _id: { $in: allUserIds as any[] } }).toArray();
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const enrichedBookings = bookings.map((b) => {
      const traveler = userMap.get(b.travelerId);
      const planner = userMap.get(b.plannerId);
      return {
        id: b._id,
        itinerary: b.itineraryId,
        traveler: traveler ? { name: traveler.name, email: traveler.email } : { name: "Unknown", email: "" },
        planner: planner ? { name: planner.name, email: planner.email } : { name: "Unknown", email: "" },
        price: b.price,
        numberOfTravelers: b.numberOfTravelers,
        totalPrice: b.totalPrice,
        startDate: b.startDate,
        status: b.status,
        createdAt: b.createdAt
      };
    });

    // Aggregate platform stats
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    res.json({
      bookings: enrichedBookings,
      stats: {
        totalBookings,
        totalRevenue
      }
    });
  } catch (error) {
    console.error("Error fetching platform bookings:", error);
    res.status(500).json({ error: "Failed to fetch platform bookings." });
  }
});

export default bookingsRouter;
