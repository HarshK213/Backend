import mongoose from 'mongoose'

const hospitalSchema = new mongoose.Schema(
     {
          name : {
               type : String,
               required : true,
          },
          addressLine1 : {
               type : String,
               required : true,
          },
          addressLine2 : {
               type : String,
          },
          city : {
               type : String,
               required : true,
          },
          pincode : {
               type : String,
               required : true,
          },
          specialization : [
               {
                    type : String,
               }
          ]
     },
     {datestamps : true}
)

export const Hospital = new mongoose.model("Hospital", hospitalSchema);