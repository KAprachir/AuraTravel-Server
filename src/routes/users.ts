import { Router } from "express";
import { db } from "../config/auth.js";
import { requireAuth, requireRole, AuthenticatedRequest } from "../middleware/auth.js";

const usersRouter = Router();

// Get all users (Admin only)
usersRouter.get("/", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const search = req.query.search as string;
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    const users = await db.collection("user").find(query).toArray();
    
    // Map _id to id for client convenience
    const mappedUsers = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role || "traveler",
      createdAt: u.createdAt
    }));
    
    res.json(mappedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// Update user role (Admin only)
usersRouter.patch("/:id/role", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    
    if (!["traveler", "planner", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified." });
    }
    
    // Safety check: Cannot demote the last admin to prevent lockout
    if (role !== "admin") {
      const adminCount = await db.collection("user").countDocuments({ role: "admin" });
      const targetUser = await db.collection("user").findOne({ _id: userId as any });
      if (targetUser && targetUser.role === "admin" && adminCount <= 1) {
        return res.status(400).json({ error: "Cannot demote the last administrator." });
      }
    }
    
    const result = await db.collection("user").updateOne(
      { _id: userId as any },
      { $set: { role, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    
    res.json({ message: "User role updated successfully.", role });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Failed to update user role." });
  }
});

// POST user onboarding profile setup
usersRouter.post("/onboarding", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { role, travelStyle, homeLocation, bio, yearsOfExperience, portfolioUrl } = req.body;

    if (!["traveler", "planner"].includes(role)) {
      return res.status(400).json({ error: "Please select a valid role: Traveler or Planner." });
    }

    const updateFields: any = {
      role,
      isOnboarded: true,
      updatedAt: new Date()
    };

    if (role === "traveler") {
      if (!travelStyle || !homeLocation) {
        return res.status(400).json({ error: "Please fill out all Traveler onboarding fields." });
      }
      updateFields.travelStyle = travelStyle;
      updateFields.homeLocation = homeLocation;
      updateFields.bio = "";
      updateFields.yearsOfExperience = 0;
      updateFields.portfolioUrl = "";
    } else {
      if (!bio || yearsOfExperience === undefined || !portfolioUrl) {
        return res.status(400).json({ error: "Please fill out all Planner onboarding fields." });
      }
      updateFields.bio = bio;
      updateFields.yearsOfExperience = Number(yearsOfExperience);
      updateFields.portfolioUrl = portfolioUrl;
      updateFields.travelStyle = "";
      updateFields.homeLocation = "";
    }

    const result = await db.collection("user").updateOne(
      { _id: userId as any },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "Onboarding completed successfully.", user: updateFields });
  } catch (error) {
    console.error("Error during user onboarding:", error);
    res.status(500).json({ error: "Failed to complete profile onboarding." });
  }
});

export default usersRouter;
