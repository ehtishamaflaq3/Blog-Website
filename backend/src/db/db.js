import mongoose from "mongoose";
import 'dotenv/config'

const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.Mongodb_Url);
        console.log("Server is connected....");
    } catch (error) {
        console.log(error);
    }
};
export default connectDb;
