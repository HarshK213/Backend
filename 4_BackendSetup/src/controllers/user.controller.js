import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js';
import {User} from '../models/user.models.js'
import cloudinaryFileUpload from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';

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
     const existUser = await User.findOne({
          $or : [{ userName }, { email }]
     })

     if(existUser){
          throw new ApiError(409, "User with this Username and email already exists.")
     }


//   4.check for images and avator
     const avatarLocalPath = req.files?.avatar[0]?.path
     // const coverImageLocalPath = req.files?.coverImage[0]?.path
     
     let coverImageLocalPath;
     if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
          coverImageLocalPath = req.files.coverImage[0].path; 
     }


     // console.log(req.files);

     if(!avatarLocalPath){
          throw new ApiError(400, "Avatar file is required")
     }


//   5.upload the images and avatar on cloudinary
     const avatar = await cloudinaryFileUpload(avatarLocalPath);
     // console.log(avatar)
     const coverImage = await cloudinaryFileUpload(coverImageLocalPath);
     // console.log(coverImage)

     if(!avatar){
          throw new ApiError(400, "Avatar file is required");
     }


//   6.create user object -> upload it on DB
     const user = await User.create({
          fullName,
          avatar : avatar.url,
          coverImage : coverImage?.url || "",
          email,
          password,
          userName : userName.toLowerCase(),
     })


//   7. remove the password and refreshtoken from response of alias
     const userCreated = await User.findById(user._id).select("-password -refreshToken")


//   8. Check for user creation
     if(!userCreated){
          throw new ApiError(500, "Something went wrong while registering user")
     }

     return res.status(200).json(
          new ApiResponse(201, userCreated, "User Registed Successfully")
     )



})

export default registerUser;