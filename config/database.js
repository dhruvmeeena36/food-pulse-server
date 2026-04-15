import { MongoClient, ServerApiVersion } from "mongodb";

let client;
let db;

export const connectDB = async () => {
  try {
    if (!client) {
      client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        maxPoolSize: 10,
      });
      await client.connect();
      console.log("✅ Connected to MongoDB");
    }
    db = client.db("food-pulse");
    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
};
