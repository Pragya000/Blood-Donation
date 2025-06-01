/* eslint-disable no-undef */
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import connect from "./config/database.js";
import cloudinaryConnect from "./config/cloudinary.js";

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import adminRoutes from './routes/admin.js'
import hospitalRoutes from './routes/hospital.js'
import postRoutes from './routes/post.js'
import findRoutes from './routes/find.js'
import requestRoutes from './routes/request.js'
import registerRoutes from './routes/registration.js'

import auth from "./middlewares/auth.js";
import hospital_auth from "./middlewares/hospital.js";
import admin_auth from "./middlewares/admin.js";

const app = express();

// Loading environment variables from .env file
dotenv.config();

// Setting up port number
const PORT = process.env.PORT || 8000;

// Setting up allowed origins
const allowedOrigins = []
if(process.env.NODE_ENV) {
  allowedOrigins.push(process.env.CLIENT_URL)
} else {
  allowedOrigins.push("http://localhost:5173")
}

// Middlewares
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy",1);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    safeFileNames: true,
  })
);

// Connecting to database
connect();

// Connect to cloudinary
cloudinaryConnect()

app.use('*', (req, res, next) => {
  //print details of incoming request
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  //move to next middleware
  next();
})

// App Routes
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/user', auth, userRoutes)
app.use('/api/v1/admin', admin_auth, adminRoutes)
app.use('/api/v1/hospital', hospital_auth, hospitalRoutes)
app.use('/api/v1/posts', auth, postRoutes)
app.use('/api/v1/find', auth, findRoutes)
app.use('/api/v1/request', auth, requestRoutes)
app.use('/api/v1/register', auth, registerRoutes)

// Test Route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

// Listening to the server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
