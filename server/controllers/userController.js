import asyncHandler from "express-async-handler";
import {toast} from 'react-toastify'
import User from "../models/UserModel.js"


export const getUserProfile=asyncHandler(async(req,res)=>{
    try {
        const id=req.params;
        const user=await User.findOne({auth0Id:id})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error getting user profile");
        toast.error(error.reponse.message);
        return res.status(500).json({message:"Internal server error"})
        
    }
})