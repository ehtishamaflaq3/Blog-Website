
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import connectDb from "./src/db/db.js";
import userRouter from "./src/routes/user.route.js";
import blogRouter from "./src/routes/blog.route.js";
import commentRouter from "./src/routes/comment.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(backendDirectory, ".env"),
});

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DevPulse Backend is running!",
  });
});

// API Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/comment", commentRouter);

// Database connection
await connectDb();

// Local development
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;