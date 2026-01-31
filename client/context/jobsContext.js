import React, { useEffect, useState } from 'react'
import { useContext,createContext } from 'react'
import { useGlobalContext } from './globalContext'
import { toast } from 'react-toastify';
import axios from 'axios';

const JobsContext=createContext()

axios.defaults.baseURL = "http://localhost:8000"
axios.defaults.withCredentials = true

export const JobsContextProvider=({children})=>{
    const {userProfile}=useGlobalContext();
    const[jobs,setJobs]=useState([])
    const[loading,setLoading]=useState(false)
    const[userJobs,setUserJobs]=useState([])
   
    const getJobs=async()=>{
        setLoading(true)
        try {
            const res=await axios.get(`/api/v1/jobs`)
            setJobs(res.data)
        } catch (error) {
            console.log("Error getting jobs")
        }
        finally{
            setLoading(false)
        }
    }

    const createJob=async(jobData)=>{
        setLoading(true)
        try {
            const res=await axios.post("/api/v1/jobs",jobData)
            toast.success("Job Create Successfully")
            setJobs((prevJobs)=>[res.data,...prevJobs])

            if(userProfile._id){
                setUserJobs((prevUserJobs)=>[res.data,...prevUserJobs])
            }
        } catch (error) {
            console.log("Error creating job",error)
        }
        finally{
            setLoading(false)
        }
    }

    const getJobsByUser=async(userId)=>{
        setLoading(true)
        try {
            const res=await axios.get(`/api/v1/jobs/user/${userId}`)
            setUserJobs(res.data)
        } catch (error) {
            console.log("Error getting job",error);
        }
        finally{
            setLoading(false)
        }
    }

    const searchJobs=async(location,tags,title)=>{
        setLoading(true)
        try {
            const query=new URLSearchParams();
            if(tags) query.append("tags",tags)
            if(location) query.append("location",location)
            if(title) query.append("title",title)

            const res=await axios.get(`/api/v1/jobs/search?${query.toString()}`)
            setJobs(res.data)
        } catch (error) {
            console.log("Error searching jobs",error)
        }
        finally{
            setLoading(false)
        }
    }
 
  const getJobById=async(id)=>{
    setLoading(true)
    try {
        const res=await axios.get(`/api/v1/jobs/${id}`)
        setLoading(false)
        return res.data;
    } catch (error) {
        console.log("Error getting jobById",error);
    }
  }

    const likeJob=async(jobId)=>{
        setLoading(true)
        try {
                await axios.put(`/api/v1/jobs/${jobId}`)
                toast.success("Job liked successfully")
        
        } catch (error) {
                console.log("Error liking job",error);
        }
        finally{
                setLoading(false)
        }
    }


    const applyJob=async(jobId)=>{
        setLoading(true)
        try {
                await axios.put(`/api/v1/apply/${jobId}`)
                toast.success("Job applied successfully");
                getJobs()
        } catch (error) {
            console.log("Error applying job",error);
            toast.error(error.response?.data?.message);
        }
        finally{
                setLoading(false)
        }
    }


    const deleteJob=async(jobId)=>{
        setLoading(true)
        try {
                await axios.delete(`/api/v1/jobs/${jobId}`)
                setJobs((prevJobs)=>prevJobs.filter((job)=>job._id!==jobId))
                setUserJobs((prevUserJobs)=>prevUserJobs.filter((job)=>job._id!==jobId))
                toast.success("Job deleted successfully");
        } catch (error) {
                console.log("Error deleting job",error)
                toast.error(error.response?.data?.message)
        }
        finally{
                setLoading(false)
        }
    }


    useEffect(()=>{
       getJobs();
       
    },[])

    useEffect(()=>{
            if(userProfile?._id){
                getJobsByUser(userProfile._id)
      }
    },[userProfile])

    return <JobsContext.Provider value={{
    
        loading,
        createJob,
        userJobs,
        searchJobs,
        getJobById,
        likeJob,
        applyJob,
        deleteJob,
        getJobsByUser,
      
    }}>{children}</JobsContext.Provider>
}

export const useJobsContext=()=>{
    return useContext(JobsContext);
}
