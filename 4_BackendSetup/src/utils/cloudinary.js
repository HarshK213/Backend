import {v2 as cloudinary} from 'cloudinary'
import {fs} from 'fs'

cloudinary.config({
     cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
     api_key : process.env.CLOUDINARY_API_KEY,
     api_secret : process.env.CLOUDINARY_API_SECRET
})

const cloudinaryFileUpload = async(LocalFilePath) => {
     try{
          if(!LocalFilePath) return null;

          // file is uploading on cloudinary
          const response = await cloudinary.uploader.upload(LocalFilePath, {
               resource_type : "auto"
          })

          // file uploaded successfully
          console.log("File have uploaded successfully",response.url);
     }catch(error){
          fs.unlink(LocalFilePath) // this will remove the temporary stored file from the server as the upload is failed.
          return null;         
     }
}

export default cloudinaryFileUpload;