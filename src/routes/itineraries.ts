import { Router } from "express";
import { Itinerary } from "../models/Itinerary.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET all public itineraries (with search, filter, sort, pagination)
router.get("/", async (req, res) => {
  try {
    const { search, category, minCost, maxCost, duration, sort, page = "1", limit = "8" } = req.query;

    const query: any = { isPublic: true };

    if (search) {
      query.$text = { $search: search as string };
    }

    if (category) {
      query.category = category as string;
    }

    if (minCost || maxCost) {
      query.cost = {};
      if (minCost) query.cost.$gte = Number(minCost);
      if (maxCost) query.cost.$lte = Number(maxCost);
    }

    if (duration) {
      query.duration = Number(duration);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortOptions: any = { createdAt: -1 }; // default newest
    if (sort === "rating") {
      sortOptions = { rating: -1 };
    } else if (sort === "cost_asc") {
      sortOptions = { cost: 1 };
    } else if (sort === "cost_desc") {
      sortOptions = { cost: -1 };
    } else if (sort === "duration_asc") {
      sortOptions = { duration: 1 };
    } else if (sort === "duration_desc") {
      sortOptions = { duration: -1 };
    }

    const itineraries = await Itinerary.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Itinerary.countDocuments(query);

    res.json({
      itineraries,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
});

// GET user's own itineraries (for dashboard)
router.get("/my", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const itineraries = await Itinerary.find({ creator: userId }).sort({ createdAt: -1 });
    res.json(itineraries);
  } catch (error) {
    console.error("Error fetching my itineraries:", error);
    res.status(500).json({ error: "Failed to fetch your itineraries" });
  }
});

// GET itinerary by ID (and find related items)
router.get("/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    // Find related itineraries in the same category
    const related = await Itinerary.find({
      category: itinerary.category,
      _id: { $ne: itinerary._id }
    }).limit(4);

    res.json({ itinerary, related });
  } catch (error) {
    console.error("Error fetching itinerary by id:", error);
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
});

// POST create itinerary
router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      title,
      shortDescription,
      fullDescription,
      coverImage,
      destination,
      duration,
      cost,
      category,
      dailyPlan,
      isPublic
    } = req.body;

    if (
      !title ||
      !shortDescription ||
      !fullDescription ||
      !coverImage ||
      !destination ||
      !duration ||
      !cost ||
      !category
    ) {
      return res.status(400).json({ error: "Please fill in all required fields" });
    }

    const userRole = req.user?.role || "traveler";
    const isPublicBool = isPublic !== undefined ? Boolean(isPublic) : true;

    if (isPublicBool && !["planner", "admin"].includes(userRole)) {
      return res.status(403).json({ error: "Only planners and admins can publish public itineraries." });
    }

    const newItinerary = new Itinerary({
      title,
      shortDescription,
      fullDescription,
      coverImage,
      destination,
      duration: Number(duration),
      cost: Number(cost),
      category,
      dailyPlan: dailyPlan || [],
      creator: req.user?.id,
      rating: 4.5,
      isPublic: isPublicBool
    });

    await newItinerary.save();
    res.status(201).json(newItinerary);
  } catch (error) {
    console.error("Error creating itinerary:", error);
    res.status(500).json({ error: "Failed to create itinerary" });
  }
});

// DELETE itinerary
router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    if (itinerary.creator !== req.user?.id) {
      return res.status(403).json({ error: "You are not authorized to delete this itinerary" });
    }

    await Itinerary.findByIdAndDelete(req.params.id);
    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    res.status(500).json({ error: "Failed to delete itinerary" });
  }
});

export default router;
