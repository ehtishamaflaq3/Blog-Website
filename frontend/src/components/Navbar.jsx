import React from 'react'
import logo from '../assets/logo.png'
import { IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { FaMoon } from "react-icons/fa";
const Navbar = () => {
  const user= false
  return (
    <div className='bg-amber-50 border-b-4 border-gray-400 h-17 flex w-full'>
    {/* logo section */}
    <div className='h-full items-center flex w-[40%]'>
      <img className='size-15 ml-15 cursor-pointer' src={logo} alt="error"  />
      <h1 className='pl-5 cursor-pointer text-3xl font-bold'>Logo</h1>
      <input type="text" placeholder='Search...' className='border-2 pl-2 ml-10 h-12 rounded-l-xl text-2xl w-77' />
      <IoSearch className='size-13 border-2 bg-black text-white rounded-r-xl '/>
    </div>
    {/* content section */}
    <div className='h-full flex ml-20 items-center flex-row w-[55%]'>
      <div className='ml-25 h-full w-95'>
      <ul className='flex items-center h-full w-[85%] justify-between'>
        <Link  to={'/'}><li className='text-2xl font-bold'>Home</li></Link>
        <Link to={'/blogs'}><li className='text-2xl font-bold'>Blogs</li></Link>
        <Link to={'/about'}><li className='font-bold text-2xl'>About</li></Link>
      </ul>
      </div>
      <div className='h-full w-[45%] flex items-center p-5 justify-between'>
        <button className='bg-black h-10 w-14 rounded-2xl text-white flex items-center cursor-pointer justify-center'><FaMoon className='size-8'/></button>
        {
          user ? <div className='border-2 rounded-full h-15 w-15 mr-10'>

          </div> : 
          <div className=' w-60 flex items-center justify-between'>
            <Link to={'/login'}>
        <button className='h-12 rounded-2xl text-2xl cursor-pointer font-bold bg-black text-white w-25 '>login</button></Link>
        <Link to={'/signup'}>
        <button className='h-12 rounded-2xl cursor-pointer text-2xl font-bold bg-black text-white w-25'>signup</button></Link>
          </div>
        }

      </div>
    </div>
    </div>
  )
}

export default Navbar