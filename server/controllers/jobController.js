import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";
import { Profiler } from "react";

export const createJob=asyncHandler(async(req,res)=>{
    try {
        const user=await User.findOne({auth0Id:req.oidc.user.sub})
        const isAuth=req.oidc.isAuthenticated() || user.email;
        if(!isAuth){
            return res.status(401).json({message:"Not authorized"})
        }
        const {title,description,location,salary,jobType,tags,skills,salaryType,negotiable}=req.body;
        if(!title){
            return res.status(400).json({message:"Title is required"});
        }
        if(!description){
            return res.status(400).json({message:"Description is required"});
        }
        if(!location || !salary || jobType || !tags || !skills || !salaryType || !negotiable){
            return res.status(400).json({message:"All fields are required"});
        }
        const job=new Job({title,description,location,salary,jobType,tags,skills,salaryType,negotiable,createdBy:user._id})
        await job.save()
        return res.status(201).json(job);

    } catch (error) {
        console.log("Error in creatingJob",error)
        return res.status(500).json({message:"Server error"})
    }
})

export const getJobs=asyncHandler(async(req,res)=>{
    try {
        const jobs = await Job.find({}).populate("createdBy", "name profilePicture").sort({ createdAt: -1 });
        
        return res.status(200).json(jobs)
    } catch (error) {
        console.log("Error in getJobs:",error);
        return res.json(500).json({message:"Server error"});
    }
})

export const getJobsByUser=asyncHandler(async(req,res)=>{
    try {
        const user=await Jobs.findById(req.params.id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const jobs=await Job.find({createdBy:user._id}).populate("createdBy","name profilePicture");
        return res.status(200).json(jobs);
    } catch (error) {
        console.log("Error in getting jobs",error);
        return res.json(500).json({message:"Server error"});
    }
})

export const searchJobs=asyncHandler(async(req,res)=>{
    try {
        const {location,tags,title}=req.query
        let query={};
        if(tags){
            query.tags={$in:tags.split(",")};
        }
        if(location){
            query.location={$regex:location,$options:"i"};
        }
        if(title){
            query.title={$regex:title,$options:"i"};
        }
        const jobs=await Job.find(query).populate("createdBy","name profilePicture")
        return res.status(200).json(jobs);

    } catch (error) {
        console.log("Error searching jobs",error)
        return res.json(500).json({message:"Server error"})
    }
})

export const applyJob=asyncHandler(async(req,res)=>{
    try {
        const job=await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({message:"Job not found"});
        
        }
        const user=await User.findOne({auth0Id:req.oidc.user.sub})
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(jobs.applicants.includes(user._id)){
            return res.status(400).json({message:"Already applied for this job"});
        }
        job.applicants.push(user._id)
        await job.save()
        return res.status(200).json(job)
        
    } catch (error) {
        console.log("Error in applying job",error)
        return res.json(500).json({message:"Server error"})
    }
})

export const likeJob=asyncHandler(async(req,res)=>{
    try {
        const job=await Job.findById(req.params.id)
        if(!job){
            return res.status(404).json({message:"Job not found"})
        }
        const user=await User.findOne({auth0Id:"User not found"})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const isLiked=job.likes.includes(user._id)
        if(isLiked){
            job.likes.filter((like)=>!like.equals(user._id))
        }
        else
        {
            job.likes.push(user._id)
        }

    } catch (error) {
        console.log("Error in liking job",error)
        return res.json(500).json({message:"Server error"})
    }
})

export const getJobById=asyncHandler(async(req,res)=>{
    try {
        const job=await Job.findById(req.params.id).populate("createdBy","name profilePicture")
        if(!job){
            return res.status(404).json({message:"Job not found"})
        }
        return res.status(200).json(job)
    } catch (error) {
        console.log("Error getting jobById",error);
        return res.status(500).json({message:"Server error"});
    }
})


export const deleteJob=asyncHandler(async(req,res)=>{
    try {
        const job=await Job.findById(req.params.id);
        const user=await User.findOne({auth0Id:req.oidc.user.sub})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        if(!job){
            return res.status(404).json({message:"Job not found"})
        }
         await job.deleteOne({_id:id});
         return res.status(200).json({message:"Job deleted successfully"});
    } catch (error) {
        console.log("Error deleting job",error);
        return res.status(500).json({message:"Server error"})
    }
})


