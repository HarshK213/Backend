import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";


export const verifyJWT = asyncHandler(async(req, res, next) => {
     try {
          const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
     
          if(!token){
               throw new ApiError(401, "Unauthorized Access");
          }
     
          const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          // console.log(decodedtoken._id);
     
          const user = await User.findById(decodedtoken?._id).select("-password -refreshToken");
     
          if(!user){
               throw new ApiError(401, "Invalid Access Token");
          }

          // console.log(user._id);
     
          req.user = user;
          next();

     } catch (error) {
          throw new ApiError(401, error?.message || "Invalid Access Token");
     }
})