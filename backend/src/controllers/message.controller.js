import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUsersForSidebar = async ( req , res)=>{
    
    try{
        const loggedUserId= req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedUserId}}).select("-password");
        //$ne = not equal to 
        //this is used so that, except for the logged in user every contact is present
        res.status(200).json(filteredUsers)

    }catch(error){
        console.log("Error in GetUsersForSidebar Controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const getMessages = async ( req , res)=>{
    
    try{
        const {id: userToChatId} =req.params;
        const userId= req.user._id;

        const messages = await Message.find(
            {
                $or:[
                    {senderId:userId, receiverID: userToChatId},
                    {senderId:userToChatId, receiverID: userId},
                ]
            });

        //$or = or
        //this is used so that, except for the logged in user every contact is present
        res.status(200).json(messages)

    }catch(error){
        console.log("Error in GetMessages Controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const sendMessage = async ( req , res)=>{
    
    try{
        const {text,image} = req.body;
        const {id : receiverID}= req.params; //renames id to receiverId
        const senderId= req.user._id; 

        let imageUrl;
        if(image){
            const uploadResponse= await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
               senderId,
               receiverID,
               text,
               image:imageUrl
            });

        await newMessage.save();
        
        
        //realtime functionality => socket.io
        const receiverSocketId= getReceiverSocketId(receiverID)
        if(receiverSocketId){
            //io.to.emit() is used because  we need to send it to only the receiver and not to everyone
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }


        res.status(201).json(newMessage)

    }catch(error){
        console.log("Error in SendMessage Controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}