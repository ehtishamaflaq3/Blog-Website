import "dotenv/config";
import express from "express";
import app from "./src/app.js";
import connectDb from "./src/db/db.js";
import userRouter from "./src/routes/user.route.js";
import blogRouter from "./src/routes/blog.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

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
// databse conection
await connectDb();

const port = Number(process.env.PORT || process.env.Port || 3000);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});