import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='border-2 flex h-[calc(100vh-4.25rem)] min-h-0 overflow-hidden border-gray-400 w-full'>
      <Sidebar/>
      <div className='min-h-0 min-w-0 flex-1 overflow-hidden'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Dashboard
