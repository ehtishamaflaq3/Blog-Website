import { Avatar, AvatarImage } from '@/components/ui/avatar'
import userLogo from '../assets/user.jpg'
import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from 'react-router-dom'
import { FaFacebook, FaGithub, FaInstagram } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa6'
import { Button } from '@base-ui/react'
const Profile = () => {
  return (
    <div className='h-156 border-2 border-gray-700'>
        <div className='max-w-6xl mx-auto mt-8'>
            <Card className='flex md:flex-row flex-col gap-10 p-10 md:p-9 dark:bg-gray-800 mx-4 md:mx-0'> 
                {/* Image Section */}
                <div className='h-full flex flex-col gap-5 items-center justify-center md:w-[350px]'>
                    <Avatar className="w-40 h-40 border-2" >
                        <AvatarImage src={userLogo}/>
                    </Avatar>
                    <h1 className='text-3xl font-bold '>Mern Stack Developer</h1>
                    <div className='flex gap-4'>
                        <Link ><FaFacebook className='size-11'/></Link>
                        <Link ><FaLinkedin className='size-11'/></Link>
                        <Link ><FaGithub className='size-11'/></Link>
                        <Link ><FaInstagram className='size-11'/></Link>
                    </div>
                </div>
                {/* info section */}
                <div className='flex flex-col border-2 p-2 w-full'>
                    <h1 className='font-bold text-center  ml-5 text-4xl mb-7'>WelCome User !</h1>
                    <p className='text-2xl'><span className='ml-5 font-semibold text-2xl '>Email : </span >ehtishamaflak@gmail.com</p>
                    <div className='flex flex-col gap-2 items-start justify-start my-4'>
                        <label className='text-2xl ml-5 font-semibold'>About Me</label>
                        <p className='border dark:border-gray-600 p-7 m-2 text-xl text-start rounded-lg'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit consequuntur aliquid tempora odit illo provident architecto laboriosam repellendus dolorem delectus</p>
                    </div>
                    <Button className="h-14 px-4 rounded-2xl text-lg font-bold md:ml-80 bg-black cursor-pointer text-white border-2 w-[20%] border-gray-400 hover:bg-gray-500 hover:text-gray-800">Edit Profile</Button>
                    {/* making dialog */}
                </div>
            </Card>
        </div>
    </div>
  )
}

export default Profile