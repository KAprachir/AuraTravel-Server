import { Router } from "express";
import { db } from "../config/auth.js";
import { ObjectId } from "mongodb";
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
    
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    if (!["traveler", "planner", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified." });
    }
    
    // Safety check: Cannot demote the last admin to prevent lockout
    if (role !== "admin") {
      const adminCount = await db.collection("user").countDocuments({ role: "admin" });
      const targetUser = await db.collection("user").findOne({ _id: new ObjectId(userId) });
      if (targetUser && targetUser.role === "admin" && adminCount <= 1) {
        return res.status(400).json({ error: "Cannot demote the last administrator." });
      }
    }
    
    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
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
    const currentUser = req.user;
    const { role, travelStyle, homeLocation, bio, yearsOfExperience, portfolioUrl } = req.body;

    if (!["traveler", "planner"].includes(role)) {
      return res.status(400).json({ error: "Please select a valid role: Traveler or Planner." });
    }

    // Preserve admin role if existing user is admin; preserve assigned role if already onboarded
    let assignedRole = role;
    if (currentUser?.role === "admin") {
      assignedRole = "admin";
    } else if (currentUser?.isOnboarded && currentUser.role) {
      assignedRole = currentUser.role;
    }

    const updateFields: any = {
      role: assignedRole,
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
      updateFields.plannerApprovalStatus = "approved";
    } else {
      if (!bio || yearsOfExperience === undefined || !portfolioUrl) {
        return res.status(400).json({ error: "Please fill out all Planner onboarding fields." });
      }
      updateFields.bio = bio;
      updateFields.yearsOfExperience = Number(yearsOfExperience);
      updateFields.portfolioUrl = portfolioUrl;
      updateFields.travelStyle = "";
      updateFields.homeLocation = "";
      updateFields.plannerApprovalStatus = "pending";
    }

    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
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

// GET pending planner applications (Admin only)
usersRouter.get("/planners/pending", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const pendingPlanners = await db.collection("user").find({
      role: "planner",
      plannerApprovalStatus: { $ne: "approved" }
    }).toArray();

    const mapped = pendingPlanners.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      bio: u.bio,
      yearsOfExperience: u.yearsOfExperience,
      portfolioUrl: u.portfolioUrl,
      plannerApprovalStatus: u.plannerApprovalStatus || "pending",
      createdAt: u.createdAt
    }));

    res.json(mapped);
  } catch (error) {
    console.error("Error fetching pending planners:", error);
    res.status(500).json({ error: "Failed to fetch pending planner applications." });
  }
});

// Approve planner application (Admin only)
usersRouter.patch("/:id/approve-planner", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { plannerApprovalStatus: "approved", updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "Planner application approved successfully." });
  } catch (error) {
    console.error("Error approving planner:", error);
    res.status(500).json({ error: "Failed to approve planner application." });
  }
});

// Reject planner application (Admin only)
usersRouter.patch("/:id/reject-planner", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { plannerApprovalStatus: "rejected", role: "traveler", updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "Planner application rejected." });
  } catch (error) {
    console.error("Error rejecting planner:", error);
    res.status(500).json({ error: "Failed to reject planner application." });
  }
});

export default usersRouter;
