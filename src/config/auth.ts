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

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true
  },
  trustedOrigins: ["http://localhost:3000"]
});
export type Auth = typeof auth;
