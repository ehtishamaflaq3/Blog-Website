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
  const getOwnBlog = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/blog/your-blog`,
        { withCredentials: true },
      );
      // Accept the current API's `blogs` key, and older responses using `blog`.
      const ownBlogs = res.data.blogs ?? res.data.blog;
      setBlogs(Array.isArray(ownBlogs) ? ownBlogs : []);
      setErrorMessage("");
    } catch (error) {
      console.error(
        "FETCH YOUR BLOGS ERROR:",
        error.response?.data || error.message,
      );
      setErrorMessage(
        error.response?.data?.message || "Could not load your blogs.",
      );
    }
  };
  // render on call
  useEffect(() => {
    getOwnBlog();
  }, []);
  // format date
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const formattedDate = date.toLocaleDateString("en-GB");
    return formattedDate;
  };
  return (
    <div className="md:pr-8 md:ml-[40px] pt-6">
      <Card className="h-full overflow-y-auto p-4 dark:bg-gray-800 ">
        <Table className="w-full h-full">
          <TableCaption>A list of your recent blogs.</TableCaption>
          <TableHeader className="w-full">
            <TableRow>
              <TableHead className="w-[300px] pl-43">Title</TableHead>
              <TableHead className="pl-30">Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >
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
                  <img
                    src={item.thumbnail}
                    alt="error"
                    className="w-30 h-25 rounded-md hidden md:block"
                  />
                  <h1 className="ml-7 hover:underline cursor-pointer">
                    {item.title}
                  </h1>
                </TableCell>
                <TableCell className="pl-30">{item.category}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>
                  <BsThreeDotsVertical className="size-5" />
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
