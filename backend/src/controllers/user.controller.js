import userCollection from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import 'dotenv/config'

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

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    };
    //    email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    };
    //    password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast 6",
      });
    }
    // check user is already or not
    const existingUserbyemail = await userCollection.findOne({ email: email });
    if (existingUserbyemail) {
      return res.status(400).json({
        success: false,
        message: "Please change email this email is already exist",
      });
    }
    // hashing pasword
    const hashPassword = await bcrypt.hash(password, 5);
    // create or register user in database
    const newUser=await userCollection.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    return res.status(201).json({
      success: true,
      message: "Account Created Succesfully",
      newUser:newUser
    });
  } catch (error) {
  console.log("REGISTER ERROR:", error);
  return res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

export const login=async (req,res)=>{
    try {
        const {email,password} = req.body;
        // checking anything is missing
        if(!email || !password ){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        // checking ser is exist or not
        let user=await userCollection.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or Password"
            })
        }
        // password validation
        const isPasswordvalid=await bcrypt.compare(password,user.password);
        if(!isPasswordvalid){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            })
        }
        // creating tokens
        const token=jwt.sign({userId:user._id},process.env.Secret_Key,{expiresIn:"1d"});
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpOnly:true,sameSite:"strict"}).json({
            success:true,
            message:`Wellcome Back ${user.firstName}`,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to register"
        })
    }
};

export const logout=async(_,res)=>{
    return res.status(200).cookie("token","",{maxAge:0}).json({
        success:true,
        message:"Logout Successfully"
    })
};