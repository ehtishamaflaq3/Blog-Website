import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const backendDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
dotenv.config({ path: path.join(backendDirectory, ".env") });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.Cloud_Name,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.Api_Key,
    api_secret: process.env.CLOUDINARY_API_SECRET || process.env.Api_Secret,
});
export default cloudinary;