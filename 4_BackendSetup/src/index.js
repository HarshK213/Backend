// require ('dotenv').config({path : './env'})
//             OR
import dotenv from 'dotenv'
dotenv.config({
     path : './env'
})

import DBConnect from "./db/db.js";


DBConnect();