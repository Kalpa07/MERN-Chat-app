// const express = require("express"); -type=commonjs
import express from "express"; //type=module 
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path"; //module built in node
// import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app,server } from "./lib/socket.js";

dotenv.config();
// const app = express();//if socketio is not used , we directly use this app

const PORT = process.env.PORT;
const __dirname = path.resolve();//



// app.use(express.json()); //(parse json) help to extract json data out of body in controllers
app.use(express.json()); 

app.use(cookieParser());//parses cookie
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true, //allow cookies to be sent in all requests
}))

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

//if we are in production make dist folder our static assets
if(process.env.Node_ENV ==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist"))); //static is a built in middleware
    // console.log("__dirname : " + __dirname);

    //this is for routes, 
    // if we go for any other routes than these two, then we will call the frontend routes
    // app.use("/api/auth",authRoutes);
    //app.use("/api/messages",messageRoutes);
    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html")); 
    });
    //
}

// app.listen(PORT, ()=>{
//     console.log("Server is running on Port : " + PORT);
//     connectDB();
// })

//instead of app we are using server bz we have built the server over the app in socket.js file
server.listen(PORT, ()=>{
    console.log("Server is running on Port : " + PORT);
    connectDB();
})