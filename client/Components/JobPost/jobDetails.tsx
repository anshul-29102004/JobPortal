"use client"
import { useGlobalContext } from '@/context/globalContext'
import React from 'react'
import ReactQuill from 'react-quill-new'
import { Label } from '../ui/label'
import 'react-quill-new/dist/quill.snow.css'

function MyEditor(){
  const{jobDescription,setJobDescription}=useGlobalContext()
  return <ReactQuill value={jobDescription} onChange={setJobDescription}
  style={{minHeight:"200px",maxHeight:"900px",}}
  
  modules={{
    toolbar:true 
  }}
  className='custom-quill-editor'/>
}

function jobDetails() {
  return (
    <div className='p-6 flex flex-col gap-4 bg-background border border-border rounded-lg'>
      <div className='grid grid-cols-2 gap-6'>
        <div className='flex-1'>
          <h3 className='text-black font-bold'>Job Description</h3>
          <Label htmlFor='jobDescription' className='text-gray-500 mt-2'>
          Provide a detailed description of the job.
          </Label>
        </div>
        <div className='flex-1'>
          <MyEditor/>

        </div>

      </div>
   
    </div>
  )
}

export default jobDetails