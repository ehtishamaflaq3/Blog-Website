import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'

const items = [
  { label: "Select a category", value: null },
  { label: "Web Development", value: "Web Development" },
  { label: "Digital Marketing", value: "Digital Marketing" },
  { label: "Blogging", value: "Blogging" },
  { label: "Photography", value: "Photography" },
  { label: "Cooking", value: "Cooking" },
]

const CreateBlog = () => {
  const [title,setTitle] =useState();
  const [category,setCategory] =useState();
  
  return (
    <div className='p-3 md:pr-6 h-screen md:ml-[130px] pt-20'>
      <Card className="md:p-8 p-4 dark:bg-gray-800">
        <h1 className='text-3xl font-bold'> Lets create blog</h1>
        <p className='text-2xl'>Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure explicabo unde autem libero soluta veniam iusto qui aut minus corruption</p>
        {/* title input section */}
        <div className='mt-3'>
          <Label className="text-2xl">
            Title
          </Label>
          <input type="text" className='border-2 dark:border-2 w-full p-4 mt-4' />
        </div>
        <div className='mt-3'>
          <Label className="text-2xl mb-4">Category</Label>
          <Select items={items}>
      <SelectTrigger className="w-full max-w-65 border-2  p-3 text-2xl">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
        </div>
        <div className='mt-3'>
          <Button className="h-12 text-2xl cursor-pointer w-[10%]">Create</Button>
        </div>
      </Card>
    </div>
  )
}

export default CreateBlog