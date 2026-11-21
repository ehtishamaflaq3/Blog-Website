import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const backendDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
dotenv.config({ path: path.join(backendDirectory, ".env") });

const connectDb = async () => {
  const mongoUrl = process.env.MONGODB_URI || process.env.Mongodb_Url;
  if (!mongoUrl) {
    throw new Error("Set MONGODB_URI in the backend .env file.");
  }
  await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected.");
};
export default connectDb;