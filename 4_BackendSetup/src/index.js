// require ('dotenv').config({path : './env'})
//             OR
import dotenv from 'dotenv'
dotenv.config({
     path : './env'
})

import DBConnect from "./db/db.js";
import app from './app.js';


DBConnect()
.then(() => {
     const port = process.env.PORT || 3000;

     // this will listen to the error and print it
     app.on("error", (error)=>{
          console.log("ERR : ",error);
          throw error;
     })

     app.listen(port, ()=>{
          console.log(`the server is running on port : ${port}`)
     })
})
.catch((error) => {
     console.log("Mongo DB Connection Error : ",error);
})