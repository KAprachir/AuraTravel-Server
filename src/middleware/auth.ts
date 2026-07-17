import { Request, Response, NextFunction } from "express";
import { auth } from "../config/auth.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    role?: "traveler" | "planner" | "admin";
  };
  session?: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. Authentication required." });
    }
    const userRole = req.user.role || "traveler";
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
    }
    next();
  };
};

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Convert Express Node headers to standard Web Headers
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, val]) => {
      if (val) {
        if (Array.isArray(val)) {
          val.forEach((v) => headers.append(key, v));
        } else {
          headers.set(key, val);
        }
      }
    });

    const session = await auth.api.getSession({
      headers
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized. Active session not found." });
    }

    req.user = session.user as any;
    req.session = session.session as any;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error during authentication." });
  }
};
