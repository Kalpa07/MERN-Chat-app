import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//next points to next function in route file, which is updateProfile
export const protectRoute =async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message:"Unauthorized -No Token Provided"});        
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message:"Unauthorized -Invalid Token Provided"});        
        }

        const user = await User.findById(decoded.userId).select("-password");
        //token is created using the userId, so we are fetching the data fields except the password
        //selects everyhting from user except the password

        if(!user){
            return res.status(401).json({message:"User Not Found"});        
        }

        req.user =user;
        next();
    }catch(error){
        console.log("Error in protectRoute",error.message);
        return res.status(500).json({message:"Internal Server Error"});        
    }

}