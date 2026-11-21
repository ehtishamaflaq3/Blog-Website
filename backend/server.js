import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import app from "./src/app.js";
import connectDb from "./src/db/db.js";
import userRouter from "./src/routes/user.route.js";
import blogRouter from "./src/routes/blog.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import commentRouter from "./src/routes/comment.route.js";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(backendDirectory, ".env") });

// default middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
const _dirname = path.resolve();
const port = Number(process.env.PORT || process.env.Port || 3000);
// for user resgisteration
app.use("/api/v1/user", userRouter);
// for blog functioning
app.use("/api/v1/blog", blogRouter);
// for comment functioning
app.use("/api/v1/comment", commentRouter);
app.use(express.static(path.join(_dirname, "/frontend/dist")));

app.use((_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});
// databse conection
await connectDb();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
