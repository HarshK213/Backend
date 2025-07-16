import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const DBConnect = async () => {
     try{
          const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
          console.log(`MONGO DB Connection established \n DB Host : ${connectionInstance.connection.host}`)
     }catch(error){
          console.error(`MongoDB Connection Error : `,error);
          process.exit(1)
     }
}

export default DBConnect;