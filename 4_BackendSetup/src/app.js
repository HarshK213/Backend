import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

// .use is used for middelwares and configurations.
app.use(cors({
     origin: process.env.CORS_ORIGIN,
     credentials : true
}));
app.use(express.json({limit : "15kb"}));
app.use(express.urlencoded({extended : true,limit : "15kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// routes
import userRoutes from './routes/user.routes.js'

// route declaration
app.use("/api/v1/users", userRoutes)

export default app;