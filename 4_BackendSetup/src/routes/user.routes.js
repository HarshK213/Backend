import { Router } from 'express'
import {loginUser, logout, registerUser, refreshAccessToken, changeCurrentPassword, getCurrUser, updateUserDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middelware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/register").post(
     upload.fields([
          {
               name : "avatar",
               maxCount : 1,
          },
          {
               name : "coverImage",
               maxCount : 1,
          }
     ]),
     registerUser
)

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT ,logout);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/get-curr-user").get(verifyJWT, getCurrUser);

router.route("/update-user-detail").patch(verifyJWT, updateUserDetails);

router.route("/update-user-avatar").patch(
     verifyJWT, 
     upload.single("avatar"),
     updateUserAvatar
)

router.route("/update-user-coverImage").patch(
     verifyJWT, 
     upload.single("coverImage"),
     updateUserCoverImage
)

router.route("/c/:userName").get(verifyJWT, getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)

export default router; 