import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const dbUri = process.env.MONGODB_URI;
if (!dbUri) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}

export const client = new MongoClient(dbUri);
export const db = client.db();

console.log("INITIALIZING BETTER-AUTH WITH:", {
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "PRESENT" : "MISSING",
  trustedOrigins: ["http://localhost:3000", process.env.CLIENT_URL].filter(Boolean)
});

export const auth = betterAuth({
  database: mongodbAdapter(db),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "traveler",
        input: false
      },
      isOnboarded: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false
      },
      travelStyle: {
        type: "string",
        required: false,
        input: false
      },
      homeLocation: {
        type: "string",
        required: false,
        input: false
      },
      bio: {
        type: "string",
        required: false,
        input: false
      },
      yearsOfExperience: {
        type: "number",
        required: false,
        input: false
      },
      portfolioUrl: {
        type: "string",
        required: false,
        input: false
      }
    }
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true
    }
  },
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }
  },
  trustedOrigins: [
    "http://localhost:3000",
    process.env.CLIENT_URL,
    process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/` : ""
  ].filter(Boolean) as string[]
});
export type Auth = typeof auth;
