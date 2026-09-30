import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";

const YourBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  // functions to get all blogs
  const getOwnBlog=async()=>{
    try {
      const res=await axios.get(`http://localhost:3000/api/v1/blog/your-blog`,{withCredentials:true})
      // Accept the current API's `blogs` key, and older responses using `blog`.
      const ownBlogs = res.data.blogs ?? res.data.blog;
      setBlogs(Array.isArray(ownBlogs) ? ownBlogs : []);
      setErrorMessage("");
    } catch (error) {
      console.error("FETCH YOUR BLOGS ERROR:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Could not load your blogs.");
    }
  };
  // render on call
  useEffect(()=>{
    getOwnBlog();
  },[]);
  // format date
  const formatDate = (createdAt)=>{
    const date=new Date(createdAt);
    const formattedDate=date.toLocaleDateString("en-GB")
    return formattedDate
  };
  return (
    <div className="md:pr-8 md:ml-[40px] pt-6">
      <Card className="h-full overflow-y-auto p-4 dark:bg-gray-800 ">
        <Table>
          <TableCaption>A list of your recent blogs.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errorMessage && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-red-500">
                  {errorMessage}
                </TableCell>
              </TableRow>
            )}
            {!errorMessage && blogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  You have not created any blogs yet.
                </TableCell>
              </TableRow>
            )}
            {blogs.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="flex gap-4 items-center">
                  <img src={item.thumbnail} alt="error" className="w-20 rounded-md hidden md:block"/>
                  <h1 className='hover:underline cursor-pointer'>{item.title}</h1>
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <BsThreeDotsVertical/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default YourBlog;
