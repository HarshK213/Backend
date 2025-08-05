import { Router } from "express";
import {getAllVideos,publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus } from '../controllers/video.controller.js'
import { upload } from "../middlewares/multer.middelware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/upload").post(verifyJWT, upload.fields([
          {
               name : "video",
               maxCount : 1,
          },
          {
               name : "thumbnail",
               maxCount : 1,
          }
     ]),publishAVideo)

router.route("/v/:videoId").get(getVideoById);

router.route("/u/:videoId").patch(upload.single('thumbnail'), updateVideo);

router.route("/del/:videoId").delete(deleteVideo);

router.route("/toggleisPublished/:videoId").patch(togglePublishStatus);

export default router;