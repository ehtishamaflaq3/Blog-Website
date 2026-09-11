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
const Profile = () => {
  return (
    <div className='h-156 border-2 border-gray-700'>
        <div className='max-w-6xl mx-auto mt-8'>
            <Card className='flex md:flex-row flex-col gap-10 p-10 md:p-9 dark:bg-gray-800 mx-4 md:mx-0'> 
                {/* Image Section */}
                <div className='h-full  flex flex-col gap-5 items-center justify-center md:w-[350px]'>
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
            </Card>
        </div>
    </div>
  )
}

export default Profile