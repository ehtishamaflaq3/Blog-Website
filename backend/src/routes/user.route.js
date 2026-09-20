import express from 'express';
import { login, logout, register,updateProfile } from '../controllers/user.controller.js';
import {isAuthenticated} from '../middleware/isAuthenticated.js'
import {singleUpload} from '../middleware/multer.js'


const userRouter= express.Router();
userRouter.route("/signup").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(logout);
userRouter.route("/profile/update").put(isAuthenticated,singleUpload,updateProfile);
userRouter.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
export default userRouter;