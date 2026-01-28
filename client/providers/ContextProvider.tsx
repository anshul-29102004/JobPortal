"use client"
import React from 'react'
import {GlobalContextProvider} from "@/context/globalContext"
import {JobsContextProvider} from "@/context/jobsContext"
import axios from 'axios'

interface Props{
    children:React.ReactNode;
}


 const ContextProvider=({children}:Props)=>{
    return <GlobalContextProvider>
      <JobsContextProvider>
       {children}
      </JobsContextProvider>
      
    
    </GlobalContextProvider>
}

export default ContextProvider