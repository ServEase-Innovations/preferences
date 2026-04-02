import { MongoClient } from "mongodb";

let db;

export const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);

    await client.connect();
    console.log("✅ MongoDB Connected");

    db = client.db(process.env.DB_NAME);
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error("DB not initialized");
  }
  return db;
};