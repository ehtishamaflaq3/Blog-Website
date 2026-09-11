import Sidebar from '../components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='border-2 flex h-[calc(100vh-4.25rem)] overflow-hidden border-gray-400 w-full'>
      <Sidebar/>
      <div className='flex-1'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Dashboard
