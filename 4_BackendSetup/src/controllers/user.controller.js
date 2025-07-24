import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js';
import {User} from '../models/user.models.js'
import cloudinaryFileUpload from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken'
import { log } from 'console';


const generateAccessandRefreshTokens = async(userId) => {
     try{
          const user = await User.findById(userId);
          // console.log(user);
          const accessToken = user.generateAccessToken();
          const refreshToken = user.generateRefreshToken();
          // console.log("after refresh token")

          user.refreshToken = refreshToken;
          await user.save({validateBeforeSave : false})

          return {accessToken, refreshToken};

     }catch(error){
          throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
     }
}

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
     // console.log("Email : ", email);


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

const loginUser = asyncHandler(async(req, res) => {
/*

     Steps for login : 
          - take email or username and password from user.
          - check wheather it is filled or not
          - check if user exist or not
          - verify password
          - generate tokens
          - send cookies
          - return the response

*/

//   1. take data from the req body
     const {userName, email, password} = req.body;

//   2. check wheather it is filled or not
     if(!(userName || email)){
          throw new ApiError(400, "Username or Email is required.");
     }

//   3. check if user exist
     const user = await User.findOne({
          $or : [{userName}, {email}]
     })

     if(!user){
          throw new ApiError(404, "User not exist.")
     }

     const ispasscorrect = await user.isPasswordCorrect(password);

     if(!ispasscorrect){
          throw new ApiError(401, "Password is incorrect.")
     }

     const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id);

     const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

     const options = {
          httpOnly : true,
          secure : true,
     }

     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", refreshToken, options)
     .json(
          new ApiResponse(
               200,
               {
                    user : loggedInUser, accessToken, refreshToken
               },
               "User logged in Successfully"
          )
     )


})

const logout = asyncHandler(async(req, res) => {
/*
     Steps for logout:
          - clear cookies
          - clear tokens

          for this we have to find user, that can be done if we have id of user.
          but how to find id??
          as unlike login we dont have username , email, and pass
          

*/

//   after getting user from verifyJWT middlware.


//   clear Tokens
     await User.findByIdAndUpdate(
          req.user._id,
          {
               $set : {
                    refreshToken : undefined
               }
          },
          {
               new : true,
          }
     )

     // console.log(req.user._id)


//   clear cookie
     const options = {
          httpOnly : true,
          secure : true,
     }

     return res
     .status(200)
     .clearCookie("accessToken", options)
     .clearCookie("refreshToken", options)
     .json(
          new ApiResponse(
               200,
               {},
               "User Logged out successfully"
          )
     )
})

const refreshAccessToken = asyncHandler(async(req, res) => {
     const givenRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

     if(!givenRefreshToken){
          throw new ApiError(401, "Unauthorized Access")
     }

     try {
          const decodedToken = jwt.verify(givenRefreshToken, process.env.REFRESH_TOKEN_SECRET);
     
          const user = User.findById(decodedToken?._id);
     
          if(!user){
               throw new ApiError(401, "Invalid Refresh Token")
          }
     
          if(givenRefreshToken !== user?.refreshToken){
               throw new ApiError(401, "Refresh Token is either used or expired");
          }
     
          const Options = {
               httpOnly : true,
               secure : true
          }
     
          const {AccessToken, RefreshToken} = generateAccessandRefreshTokens(user._id);
     
          return res
          .status(200)
          .cookie("accessToken", AccessToken, Options)
          .cookie("refreshToken", RefreshToken, Options)
          .json(
               new ApiResponse(
                    200,
                    {
                         AccessToken, refreshToken: RefreshToken
                    },
                    "Access Token refreshed Successfully."
               )
          )
     } catch (error) {
          throw new ApiError(401, error?.message || "Invalid Refresh Tokens");
     }
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
     const {oldPassword, newPassword, confPassword} = req.body;

     // console.log(oldPassword);
     // console.log(newPassword);

     if(newPassword !== confPassword){
          throw new ApiError(401, "New Password and Confirm Password are not same.")
     }

     const user = await User.findById(req.user._id);
     console.log(req.user._id)


     const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

     if(!isPasswordCorrect){
          throw new ApiError(400, "Given Password is incorrect");
     }

     user.password = newPassword;
     user.save({validateBeforeSave : false});

     // console.log(user.password)

     return res
     .status(200)
     .json(new ApiResponse(200, {}, "Password Changed Successfully"));

})

const getCurrUser = asyncHandler(async(req, res) => {
     const user = await User.findById(req.user._id);
     
     if(!user){
          throw new ApiError(404, "User not logged in.");
     }

     return res
     .status(200)
     .json(new ApiResponse(
          200,
          {
               user,
          },
          "Current User get Successfully"
     ))
})

const updateUserDetails = asyncHandler(async(req, res) => {
     const {fullName, email} = req.body;

     if(!fullName || !email){
          throw new ApiError(401, "All fields are required")
     }

     const user = await User.findByIdAndUpdate(
          req.user?._id,
          {
               $set : {
                    fullName,
                    email
               }
          },
          {
               new : true
          }
     ).select("-password")

     console.log(user)

     return res
     .status(200)
     .json(new ApiResponse(
          200,
          {user},
          "User Details are Updated Successfully"
     ))

})

export {
     registerUser,
     loginUser,
     logout,
     refreshAccessToken,
     changeCurrentPassword,
     getCurrUser,
     updateUserDetails
};