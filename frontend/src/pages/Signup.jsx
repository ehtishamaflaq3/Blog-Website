import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authimg from '../assets/auth.jpg'
import axios from 'axios'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
const Signup = () => {
  const navigate=useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [user,setuser]=useState({
    firstName:"",
    lastName:"",
    email:"",
    password:"",
  });
  const handleChange=(e)=>{
    const {name,value}=e.target;
    setuser((prev)=>({
      ...prev,
      [name]:value,
    }))
  };
  const handleSubmit= async(e)=>{
    e.preventDefault();
    console.log(user);
    try {
      const req= await axios.post("http://localhost:3000/api/v1/user/signup",user,{
        headers:{
          "Content-type":"application/json"
        },withCredentials:true})
        console.log("response",req.data);
        if (req.data.success) {
          navigate('/login');
        }
    } catch (error) {
       console.log("STATUS:", error.response?.status);
  console.log("DATA:", error.response?.data);
  console.log("MESSAGE:", error.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <div className='h-full w-full flex flex-col lg:flex-row lg:overflow-hidden'>
      {/* image section */}
      <div className='w-full lg:w-[50%]'>
        <img src={authimg} className='h-56 w-full object-cover sm:h-72 lg:h-full' alt="error" />
      </div>

      {/* form section */}
      <div className='w-full lg:w-[50%] flex items-center justify-center px-4 py-4 sm:px-6 lg:px-8 lg:py-0'>
        <form onSubmit={handleSubmit} className='w-full max-w-xl rounded-2xl border border-gray-500 bg-white p-4 shadow-2xl sm:p-6 lg:p-6 lg:max-h-[90vh]' action="">
          <h1 className='text-2xl font-extrabold sm:text-3xl'>Create an Account</h1>
          <p className='mt-2 text-base font-bold sm:text-xl'>Enter your details below to create your account</p>

          {/* name */}
          <div className='mt-4 flex flex-col gap-4 sm:flex-row'>
            <div className='w-full sm:w-1/2'>
              <label className='mb-2 block text-lg font-semibold sm:text-xl' htmlFor="">First Name</label>
              <input type="text" name='firstName' value={user.firstName} onChange={handleChange} className='h-12 w-full rounded-2xl border border-gray-400 pl-3 text-base shadow-2xl sm:h-14 sm:text-xl' placeholder='First Name' />
            </div>
            <div className='w-full sm:w-1/2'>
              <label className='mb-2 block text-lg font-semibold sm:text-xl' htmlFor="">Last Name</label>
              <input className='h-12 w-full rounded-2xl border border-gray-400 pl-3 text-base shadow-2xl sm:h-14 sm:text-xl' type="text" value={user.lastName} name='lastName' onChange={handleChange} placeholder='Last Name' />
            </div>
          </div>
          {/* email and passwords */}
          <div className='mt-4 flex flex-col gap-4'>
            <div>
              <label className='mb-2 block text-lg sm:text-2xl' htmlFor="">Email</label>
              <input type="text" name='email' onChange={handleChange} value={user.email} className='h-12 w-full rounded-2xl border border-gray-400 pl-3 text-base shadow-2xl sm:h-14 sm:text-xl' placeholder='johndoe@example.com' />
            </div>
            <div>
              <label htmlFor="" className='mb-2 block text-lg sm:text-2xl'>Password</label>
              <div className='relative w-full'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className='h-12 w-full rounded-2xl border border-gray-400 pl-3 pr-12 text-base shadow-2xl sm:h-14 sm:text-xl'
                  value={user.password} name='password' onChange={handleChange} placeholder='Password...'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <button className='mt-4 flex h-12 w-full items-center justify-center rounded-2xl bg-black text-xl font-bold text-white shadow-md transition hover:bg-gray-800 sm:h-14 sm:text-2xl'>Sign Up</button>
          <p className='mt-3 text-center text-sm sm:text-base'>Already have an account? <Link to={'/login'}><span className='cursor-pointer underline text-gray-500'>Sign in</span></Link></p>
        </form>
      </div>
    </div>
  )
}

export default Signup