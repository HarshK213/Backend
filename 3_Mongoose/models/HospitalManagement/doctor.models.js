import mongoose from 'mongoose'

const doctorSchema = new mongoose.Scheme(
     {
          name : {
               type : String,
               required : true,
          },
          salary : {
               type : Number,
               required : true,
          },
          qualification : [
               {
                    type : String,
                    required : true,
               }
          ],
          experienceInYears : {
               type : Number, 
               default : 0,
          },
          worksInHospital : [
               {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "Hospital",
               }
          ]
     },
     {datestamps : true}
)

export const Doctor = new mongoose.model("Doctor", doctorSchema)