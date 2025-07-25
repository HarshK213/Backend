import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
     id : {
          type : String,    
     },
     watchHistory : [
          {
               type : mongoose.Schema.Types.ObjectId,
               ref : "Video",
          }
     ],
     userName : {
          type : String,
          required : true,
          unique : true,
          lowercase : true,
          trim : true,
          index : true,
     },
     email : {
          type : String,
          required : true,
          unique : true,
          lowercase : true,
          trim : true,
     },
     fullName : {
          type : String,
          required : true,
          trim : true,
          index : true,
     },
     avatar : {
          type : String,
          required : true,
     },
     coverImage : {
          type : String,
     },
     password : {
          type : String,
          required : [true, "Password is required"]
     },
     refreshToken : {
          type : String,
     },
},{
     timestamps : true,
})

userSchema.pre("save", async function(next){
     if(this.isModified("password")){
          this.password = await bcrypt.hash(this.password, 10);
     }
     next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
     return await bcrypt.compare(password, this.password)     
}

userSchema.methods.generateAccessToken = function(){
     // console.log("Inside Access token")
     return jwt.sign(
          {
               _id : this._id,
               email : this.email,
               userName : this.userName,
               fullName : this.fullName
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
               expiresIn : process.env.ACCESS_TOKEN_EXPIRY
          }
     )
}

userSchema.methods.generateRefreshToken = function(){
     // console.log("Inside refresh token")
     return jwt.sign(
          {
               id : this.id,
          },
          process.env.REFRESH_TOKEN_SECRET,
          {
               expiresIn : process.env.REFRESH_TOKEN_EXPIRY
          }
     )
}

export const User = new mongoose.model("User", userSchema);