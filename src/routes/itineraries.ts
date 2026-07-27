import { Router } from "express";
import { Itinerary } from "../models/Itinerary.js";
import { requireAuth, requireRole, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET all public itineraries (with search, filter, sort, pagination)
router.get("/", async (req, res) => {
  try {
    const { search, category, minCost, maxCost, duration, sort, page = "1", limit = "8" } = req.query;

    const query: any = {
      isPublic: true,
      $or: [{ status: "approved" }, { status: { $exists: false } }, { status: null }]
    };

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

// GET pending itineraries for admin review (Admin only)
router.get("/pending", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const pending = await Itinerary.find({ status: "pending_approval" }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) {
    console.error("Error fetching pending itineraries:", error);
    res.status(500).json({ error: "Failed to fetch pending itineraries" });
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
      _id: { $ne: itinerary._id },
      status: "approved"
    }).limit(4);

    res.json({ itinerary, related });
  } catch (error) {
    console.error("Error fetching itinerary by id:", error);
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
});

// POST create itinerary
router.post("/", requireAuth, requireRole(["planner", "admin"]), async (req: AuthenticatedRequest, res) => {
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

    // Admins get automatic approval; planner submissions require admin review approval
    const approvalStatus = req.user?.role === "admin" ? "approved" : "pending_approval";

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
      isPublic: isPublicBool,
      status: approvalStatus
    });

    await newItinerary.save();
    res.status(201).json(newItinerary);
  } catch (error) {
    console.error("Error creating itinerary:", error);
    res.status(500).json({ error: "Failed to create itinerary" });
  }
});

// PATCH approve itinerary (Admin only)
router.patch("/:id/approve", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      { status: "approved", isPublic: true },
      { new: true }
    );
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    res.json({ message: "Itinerary approved successfully.", itinerary });
  } catch (error) {
    console.error("Error approving itinerary:", error);
    res.status(500).json({ error: "Failed to approve itinerary" });
  }
});

// PATCH reject itinerary (Admin only)
router.patch("/:id/reject", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", isPublic: false },
      { new: true }
    );
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    res.json({ message: "Itinerary rejected.", itinerary });
  } catch (error) {
    console.error("Error rejecting itinerary:", error);
    res.status(500).json({ error: "Failed to reject itinerary" });
  }
});

// PUT update itinerary
router.put("/:id", requireAuth, requireRole(["planner", "admin"]), async (req: AuthenticatedRequest, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    if (itinerary.creator !== req.user?.id && req.user?.role !== "admin") {
      return res.status(403).json({ error: "You are not authorized to update this itinerary" });
    }

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

    if (title) itinerary.title = title;
    if (shortDescription) itinerary.shortDescription = shortDescription;
    if (fullDescription) itinerary.fullDescription = fullDescription;
    if (coverImage) itinerary.coverImage = coverImage;
    if (destination) itinerary.destination = destination;
    if (duration !== undefined) itinerary.duration = Number(duration);
    if (cost !== undefined) itinerary.cost = Number(cost);
    if (category) itinerary.category = category;
    if (dailyPlan) itinerary.dailyPlan = dailyPlan;
    if (isPublic !== undefined) itinerary.isPublic = Boolean(isPublic);

    await itinerary.save();
    res.json(itinerary);
  } catch (error) {
    console.error("Error updating itinerary:", error);
    res.status(500).json({ error: "Failed to update itinerary" });
  }
});

// DELETE itinerary
router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    if (itinerary.creator !== req.user?.id && req.user?.role !== "admin") {
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
