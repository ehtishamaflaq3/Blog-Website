import Sidebar from '../components/Sidebar'
import React from 'react'
import Outlet from '../components/Outlet'

const Dashboard = () => {
  return (
    <div className='flex'>
      <Sidebar/>
      <div className='flex'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Dashboard