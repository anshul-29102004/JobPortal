import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export const adminLogin=asyncHandler(async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password)
        {
            return res.status(401).json({message:"Please enter email id and password"});
        }
        const isMatchpass=await bcrypt.compare(password,process.env.ADMIN_PASSWORD)
        
        if(!isMatchpass)
        {
            return res.status(401).json({message:"Invalid credentials"})
        }
        if(email !==process.env.ADMIN_EMAIL)
        {
            return res.status(401).json({message:"Invalid credentials"})
        }
         const token=jwt.sign({role:"admin"},process.env.JWT_SECRET,{expiresIn:"1d"});
         return res.status(200).json({success:true,message:"Admin login successfull",token})
    } catch (error) {
        res.status(500).json({message:"Server error"});
    }
})