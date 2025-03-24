import { Server } from "socket.io";
import http from "http"; //in-built
import express from "express";


const app = express();
const server = http.createServer(app);


const io = new Server(server,{
    cors: { 
        origin: ["http://localhost:4173"],
    }
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

//used to store online users
const userSocketMap = {}; //{userId:socketId}

io.on("connection",(socket)=>{          //listen to any incoming connections
    console.log("A user Connected",socket.id);

    const userId = socket.handshake.query.userId;//for online users
    if(userId) {
        userSocketMap[userId] = socket.id;
    }

    // io.emit() is used to send events to all the connected clients
    //getOnline Users is the name of the method, and we are sending the user id's stored in the userSOcketMap
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{       //listen to disconnect event
        console.log("User disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})
export {io,app,server};