import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const dbUri = process.env.MONGODB_URI;
if (!dbUri) {
  console.error("Error: MONGODB_URI is not defined in environment variables.");
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.error("Error: Please provide a user email as an argument.");
  console.log("Usage: npx ts-node src/scripts/make-admin.ts <email>");
  process.exit(1);
}

async function run() {
  const client = new MongoClient(dbUri!);
  try {
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection("user");

    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.error(`Error: User with email "${email}" not found.`);
      process.exit(1);
    }

    const result = await usersCollection.updateOne(
      { _id: user._id },
      { $set: { role: "admin", updatedAt: new Date() } }
    );

    if (result.modifiedCount > 0) {
      console.log(`Success: User "${email}" has been successfully promoted to "admin".`);
    } else {
      console.log(`Notice: User "${email}" is already an "admin" or role was not modified.`);
    }
  } catch (error) {
    console.error("Error running script:", error);
  } finally {
    await client.close();
  }
}

run();
