import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js';
import {User} from '../models/user.models.js'
import cloudinaryFileUpload from '../utils/cloudinary.js';

const registerUser = asyncHandler(async(req, res)=>{
     // res.status(200).json({
     //      message : "Hello World",
     // })

     /*
          now we will register user, these are the following step for this : 
               - get info from user(FRONTEND)
               - check wheather the info is correctly filled (empty or correct email format, etc)
               - check if the user exist or not
               - check for images and avator
               - upload the images and avatar on cloudinary
               - create user object -> upload it on DB
               - check if the user successfully created
               - remove the password and refreshtoken from response of alias
               - return response to user(FRONTEND)

     */

//   1.get info from user(FRONTEND)
     const { userName, email, fullName, password } = req.body;
     console.log("Email : ", email);


//   2.check wheather the info is correctly filled
     if(userName === ""){
          throw new ApiError(400, "User Name is required")
     }
     if(email === ""){
          throw new ApiError(400, "Email is required")
     }
     if(fullName === ""){
          throw new ApiError(400, "Name is required")
     }
     if(password === ""){
          throw new ApiError(400, "Password is required")
     }


//   3.check if the user exist or not
     const existUser = User.findOne({
          $or : [{ userName }, { email }]
     })

     if(existUser){
          throw new ApiError(409, "User with this Username and email already exists.")
     }


//   4.check for images and avator
     const avatarLocalPath = req.files?.avatar[0]?.path
     const coverImageLocalPath = req.files?.coverImage[0]?.path

     if(avatarLocalPath){
          throw new ApiError(400, "Avatar file is required")
     }


//   5.upload the images and avatar on cloudinary
     await cloudinaryFileUpload(avatarLocalPath);
     if(coverImageLocalPath){
          await cloudinaryFileUpload(coverImageLocalPath);
     }



})

export default registerUser;