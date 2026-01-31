import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
const GlobalContext = createContext()

axios.defaults.baseURL = "http://localhost:8000"
axios.defaults.withCredentials = true

export const GlobalContextProvider = ({ children }) => {
  const router = useRouter()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [auth0User, setAuth0User] = useState(null)
  const [userProfile, setUserProfile] = useState({})
  const [loading, setLoading] = useState(false)

  const[jobTitle,setJobTitle]=useState(" ");
  const[jobDescription,setJobDescription]=useState(" ");
  const[salary,setSalary]=useState(0);
  const[activeEmploymentTypes,setActiveEmploymentTypes]=useState([]);
  const[salaryType,setSalaryType]=useState("Year");
  const[negotiable,setNegotiable]=useState([]);
  const[skills,setSkills]=useState([]);
  const[tags,setTags]=useState([]);
  const[location,setLocation]=useState({
    country:"",
    city:"",
    address:"",
  })






  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true)
      try {
        const res = await axios.get("/api/v1/check-auth")
        setIsAuthenticated(res.data.isAuthenticated)
        setAuth0User(res.data.user)
      } catch (error) {
        console.log("Error checking auth", error)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const getUserProfile = async (id) => {
    try {
      const res = await axios.get(`/api/v1/user/${id}`)
      setUserProfile(res.data)
    } catch (error) {
      console.log("Error getting profile", error)
    }
  }


  const handleTitleChange=(e)=>{
    setJobTitle(e.target.value.trimStart());
  }

  const handleDescriptionChange=(e)=>{
    setJobDescription(e.target.value.trimStart());
  }

  const handleSalaryChange=(e)=>{
    setSalary(e.target.value);
  }

  const resetJobForm = () => {
    setJobTitle(" ");
    setJobDescription(" ");
    setSalary(0);
    setActiveEmploymentTypes([]);
    setSalaryType("Year");
    setNegotiable([]);
    setSkills([]);
    setTags([]);
    setLocation({
      country: "",
      city: "",
      address: "",
    });
  };



  useEffect(()=>{
    if(isAuthenticated && auth0User){
        getUserProfile(auth0User.sub)
    }
  },[isAuthenticated,auth0User])

  return (
    <GlobalContext.Provider value={{
      isAuthenticated,
      auth0User,
      userProfile,
      getUserProfile,
      loading,
      jobTitle,
      jobDescription,
      salary,
      activeEmploymentTypes,
      salaryType,
      negotiable,
      tags,
      setTags,
      skills,
      setSkills,
      location,
      setLocation,
      handleTitleChange,
      handleSalaryChange,
      handleDescriptionChange,
      setActiveEmploymentTypes,
      resetJobForm,

      
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(GlobalContext)
}