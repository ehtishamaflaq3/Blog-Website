import userCollection from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// export const register = async (req, res) => {
//   try {
//     console.log("🔥 REQ BODY:", req.body);
//     console.log("🔥 CONTENT TYPE:", req.headers["content-type"]);

//     return res.status(200).json({
//       success: true,
//       body: req.body,
//     });
//   } catch (error) {
//     console.log("ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// user registration
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body ?? {};
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    //    email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }
    //    password validation
    if (password.length < 6 || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 6 and 72 bytes",
      });
    }
    // check user is already or not
    const existingUserbyemail = await userCollection.findOne({
      email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i"),
    });
    if (existingUserbyemail) {
      return res.status(409).json({
        success: false,
        message: "Please change email this email is already exist",
      });
    }
    // hashing pasword
    const hashPassword = await bcrypt.hash(password, 5);
    // create or register user in database
    const newUser = await userCollection.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashPassword,
    });
    const user = newUser.toObject();
    delete user.password;
    return res.status(201).json({
      success: true,
      message: "Account Created Succesfully",
      newUser: user,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// user login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    // checking anything is missing
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // checking ser is exist or not
    const normalizedEmail = email.trim().toLowerCase();
    let user = await userCollection.findOne({
      email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i"),
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or Password",
      });
    }
    // password validation
    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if (!isPasswordvalid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    // creating tokens
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || process.env.Secret_Key,
      {
        expiresIn: "1d",
      }
    );
    const safeUser = user.toObject();
    delete safeUser.password;
    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };
    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message: `Wellcome Back ${user.firstName}`,
        user: safeUser,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to log in",
    });
  }
};

// user logout

export const logout = async (_, res) => {
  return res
    .status(200)
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .json({
      success: true,
      message: "Logout Successfully",
    });
};

// user edit profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const {
      firstName,
      lastName,
      facebook,
      instagram,
      linkedin,
      github,
      occupation,
      bio,
    } = req.body ?? {};
    const file = req.file;
    for (const [field, value] of Object.entries({
      firstName,
      lastName,
      facebook,
      instagram,
      linkedin,
      github,
      occupation,
      bio,
    })) {
      if (value !== undefined && typeof value !== "string") {
        return res.status(400).json({
          success: false,
          message: `${field} must be a string.`,
        });
      }
    }

    if (
      (firstName !== undefined && !firstName.trim()) ||
      (lastName !== undefined && !lastName.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "First name and last name cannot be empty.",
      });
    }
    let cloudResponse;
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await userCollection.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not Found",
        success: false,
      });
    }
    // updating data
    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (occupation !== undefined) user.occupation = occupation.trim();
    if (typeof instagram === "string") user.instagram = instagram.trim();
    if (typeof facebook === "string") user.facebook = facebook.trim();
    if (typeof linkedin === "string") user.linkedin = linkedin.trim();
    if (typeof github === "string") user.github = github.trim();
    if (bio !== undefined) user.bio = bio;
    if (file) user.photoUrl = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "Profile Updated Successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
