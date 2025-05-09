import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res)=>{
    const { fullName,email,password}= req.body;
    try{
        if(!fullName || !email || !password)
        {
            return res.status(400).json({message:"All fields are required"})
        }        
        //hash password
        if(password.length<8){
             return res.status(400).json({message:"Password must be at least 8 characters"})
        }
        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message:"Email Already Exists"});
        };
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName, //fullName:fullName,
            email, //email:email,
            password:hashedPassword,
        })
        
        if(newUser){
            //generate jwt token => we can write the code here, but will create a function in lib folder in utils.js file
            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else{
            return res.status(400).json({message:"Invalid User Data"});
        }
    }catch(error){
        console.log("Error in Signup Controller; ",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const login =async (req,res)=>{
    const {email, password}= req.body;
    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isPasswordCorrect= await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }

        generateToken(user._id,res);

        res.status(200).json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    }catch(error){
        console.log("Error in Login Controller; ",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const logout = (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged Out Successfully"});
    }
    catch(error){
        console.log("Error in Logout Controller; ",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const updateProfile = async (req,res)=>{
    //to update profile piicture we will use cloudinary
    try{
       const { profilePic}= req.body;
       const userId=req.user._id;
       if(!profilePic){
        return res.status(400).json({message:"Profile Pic is Required"});
       }
       const uploadResponse = await cloudinary.uploader.upload(profilePic);

       const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
       //update the user with secure url which cloudinary as given back
       //new:true , returns the updated data 
       res.status(200).json(updatedUser);

    }
    catch(error){
        console.log("Error in UpdateProfile Controller; ",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

//gives authenticated user
export const checkAuth = (req,res)=>{
    try{
       res.status(200).json(req.user);
    }
    catch(error){
        console.log("Error in Check Controller; ",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
