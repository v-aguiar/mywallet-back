import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

console.log("mongo url: ", process.env.MONGODB_URL);

const mongoClient = new MongoClient(
  process.env.MONGODB_URL || "mongodb://27017"
);

let db = null;

try {
  await mongoClient.connect();
  db = mongoClient.db("mywallet-api");
} catch (e) {
  console.error("⚠ Could not connect to MongoDB!");
}

export default db;
