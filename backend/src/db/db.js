import mongoose from "mongoose";
import "dotenv/config";

const connectDb = async () => {
  const mongoUrl = process.env.Mongodb_Url || process.env.MONGODB_URI;
  if (!mongoUrl) {
    throw new Error("Set MONGODB_URI in the backend .env file.");
  }

  await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected.");
};

export default connectDb;
