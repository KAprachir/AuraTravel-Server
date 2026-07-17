import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const dbUri = process.env.MONGODB_URI;
if (!dbUri) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}

const client = new MongoClient(dbUri);
const db = client.db();

console.log("INITIALIZING BETTER-AUTH WITH:", {
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "PRESENT" : "MISSING",
  trustedOrigins: ["http://localhost:3000", process.env.CLIENT_URL].filter(Boolean)
});

export const auth = betterAuth({
  database: mongodbAdapter(db),
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
