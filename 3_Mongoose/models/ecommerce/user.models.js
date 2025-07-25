import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
     {
          username : {
               type : String,
               required : true,
               lowercase : true,
          },
          email : {
               type : String,
               required : true,
               lowercase : true,
               unique : true,
          },
          password : {
               type : String,
               required : true,
          }
     },
     {
          datestamps : true,
     }
);

export const User = mongoose.model("User", userSchema);