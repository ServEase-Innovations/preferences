import { MongoClient } from "mongodb";

let db;

export const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);

    await client.connect();

    const dbName = process.env.DB_NAME?.trim();
    // Empty DB_NAME → driver uses default database from MONGO_URI (see MongoClient.db)
    db = client.db(dbName || undefined);

    console.log(`✅ MongoDB Connected (database: ${db.databaseName})`);
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