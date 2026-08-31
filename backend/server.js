import app from "../../Blog-Website/backend/src/app.js";
import 'dotenv/config'
import connectDb from "../../Blog-Website/backend/src/db/db.js";
import express from 'express'
import userRouter from "./src/routes/user.route.js";
import cors from 'cors'

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))


// for user resgisteration
app.use("/api/v1/user",userRouter);

// databse cnnection
await connectDb();
// server connection
app.listen(process.env.Port,()=>{
    console.log("Server is runing");
});