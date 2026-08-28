import app from "../../Blog-Website/backend/src/app.js";
import 'dotenv/config'
import connectDb from "../../Blog-Website/backend/src/db/db.js";




// databse cnnection
await connectDb();
// server connection
app.listen(process.env.Port,()=>{
    console.log("Server is runing");
});