import express from "express";
import {login,logout,signup,updateProfile,checkAuth} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router =express.Router();

// router.post("/signup",(res,req)=>{   this function
//     res.send("signup route");        is moved to controllers to have 
// })

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

//protectRoute is a middleware(in auth.middleware), function which checks if user is logged in
router.put("/update-profile",protectRoute,updateProfile); 

router.get("/check",protectRoute,checkAuth); 



export default router;