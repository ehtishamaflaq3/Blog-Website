import app from "../../Blog-Website/backend/src/app.js";
import "dotenv/config";
import connectDb from "../../Blog-Website/backend/src/db/db.js";
import express from "express";
import userRouter from "./src/routes/user.route.js";
import blogRouter from "./src/routes/blog.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// for user resgisteration
app.use("/api/v1/user", userRouter);

// for blog functioning
app.use("/api/v1/blog", blogRouter);

// databse cnnection
await connectDb();

// server connection
app.listen(process.env.Port, () => {
  console.log("Server is runing");
});
