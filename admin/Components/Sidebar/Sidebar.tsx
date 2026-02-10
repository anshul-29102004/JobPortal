import Link from 'next/link'
import React from 'react'

function Sidebar() {
  return (
    <div className='w-64 bg-gray-900 min-h-screen shadow-lg'>
        <div className='border-b border-gray-700 px-6 py-8'>
            <h2 className='text-2xl font-bold text-white'>Admin Panel</h2>
        </div>
        <nav className='px-4 py-6'>
            <ul className='space-y-2'>
                <li>
                    <Link href="/postjob" className='flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-300 border-l-4 border-transparent hover:border-blue-500 hover:pl-5'>
                      <span className='text-xl'>📝</span>
                      Post a Job
                    </Link>
                </li>
                <li>
                    <Link href="/approve" className='flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-300 border-l-4 border-transparent hover:border-green-500 hover:pl-5'>
                      <span className='text-xl'>✓</span>
                      Approve
                    </Link>
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default Sidebar