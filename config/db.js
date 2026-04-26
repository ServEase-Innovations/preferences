import { MongoClient } from "mongodb";

let db;

function getMongoUri() {
  const uri =
    process.env.MONGO_URI?.trim() || process.env.MONGODB_URI?.trim();
  return uri && uri.length > 0 ? uri : null;
}

export const connectDB = async () => {
  try {
    const mongoUri = getMongoUri();
    if (!mongoUri) {
      console.error("❌ Set MONGO_URI in services/preferences/.env");
      console.error(
        "   Example: MONGO_URI=mongodb://127.0.0.1:27017\n" +
          "   Start local Mongo: from the monorepo root run  docker compose up -d"
      );
      throw new Error(
        "MONGO_URI (or MONGODB_URI) is not set. See services/preferences/.env.example"
      );
    }

    const client = new MongoClient(mongoUri);

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