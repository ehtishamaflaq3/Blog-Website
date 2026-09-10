import Sidebar from '../components/Sidebar'
import React from 'react'
import Outlet from '../components/Outlet'

const Dashboard = () => {
  return (
    <div className='border-2 border-gray-400 h-156 w-full'>
      <Sidebar/>
      <div className='flex'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Dashboard