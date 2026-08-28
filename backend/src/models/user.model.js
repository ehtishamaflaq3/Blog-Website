import mongoose from "mongoose";
const userSchema = new mongoose.connect(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    occupation: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    facebook: { type: String, default: "" },
  },
  {timestamps: true},
);

const userCollection = mongoose.model("user", userSchema);
export default userCollection;