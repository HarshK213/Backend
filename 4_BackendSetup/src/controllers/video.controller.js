import { Video } from "../models/video.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { cloudinaryFileUpload } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination 
})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    
    const { title, description} = req.body
    if(title == ""){
        throw new ApiError(400, "Title is required")
    }
    if(description == ""){
        throw new ApiError(400, "Description is requied")
    }


// Video Upload
    const videoLocalPath = req.files?.video[0]?.path;
    console.log(videoLocalPath);
    if(!videoLocalPath){
        throw new ApiError(400, "Video file is requied")
    }
    

// Thumbnail Upload
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    console.log(thumbnailLocalPath)
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail file is required")
    }
    

// resourse upload on cloudinary
    const videoLink = await cloudinaryFileUpload(videoLocalPath,{resource_type : "video"});
    if(!videoLink){
        throw new ApiError(400, "Something went wrong while uploading video");
    }
    console.log(videoLink);
    
    const thumbnailLink = await cloudinaryFileUpload(thumbnailLocalPath);
    if(!thumbnailLink){
        throw new ApiError(400, "Something went wrong while uploading thumbnail");
    }
    console.log(thumbnailLink)



    const video = await Video.create({
        videoFile : videoLink.url,
        thumbnail : thumbnailLink.url,
        pwner : req.user?._id,
        title,
        description,
        duration : videoLink.duration,   
})
    console.log(video)
    const videoCreated = await Video.findById(video._id)
    if(!videoCreated){
        throw new ApiError(400, "Something went wrong while registering video file")
    }
    console.log(videoCreated)


    return res
    .status(200)
    .json(new ApiResponse(200, videoCreated, "video uploaded successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    console.log(videoId);
    const video = await Video.findById(videoId);
    console.log(video);
    if(!video){
        throw new ApiError(400, "Video now found");
    }

    res
    .status(200)
    .json(new ApiResponse(200, {video}, "Video found"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}