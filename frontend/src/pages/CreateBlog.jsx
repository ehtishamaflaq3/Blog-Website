import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { setBlog } from "@/redux/blogSlice";
import { toast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

// category items for displaying
const items = [
  { label: "Select a category", value: null },
  { label: "Web Development", value: "Web Development" },
  { label: "Digital Marketing", value: "Digital Marketing" },
  { label: "Blogging", value: "Blogging" },
  { label: "Photography", value: "Photography" },
  { label: "Cooking", value: "Cooking" },
];

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog, loading } = useSelector((store) => store.blog);

  // toast function
    function showToast() {
    toast.add({
      title: "Blog Created Successfully",
      description: "Your Blogs",
      type: "success",
    });
  }
  // blog handler
  const createBlogHandler = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        "http://localhost:3000/api/v1/blog/create-blog",
        { title, category,subTitle },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        if (!blog) {
          dispatch(setBlog([res.data.blog]));
        }
        dispatch(setBlog([...blog, res.data.blog]));
        // navigate(`/dashboard/write-blog/${res.data.blog._id}`);
        navigate(`/dashboard/your-blog/`);
        showToast();
      }
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("SERVER RESPONSE:", error.response?.data);
      console.log("STATUS:", error.response?.status);
    } finally {
      setLoading(false);
    }
  };
  // getting category value
  const getSelectedCategory = async (value) => {
    setCategory(value);
  };
  return (
    <div className=" md:pr-5 h-screen md:ml-[60px] pt-10">
      <Card className="p-5 dark:bg-gray-800">
        <h1 className="text-3xl font-bold"> Lets create blog</h1>
        <p className="text-2xl">
          Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Iure explicabo unde autem
          libero soluta veniam iusto qui aut minus corruption
        </p>
        {/* title input section */}
        <div className="mt-2">
          <Label className="text-2xl">Title</Label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write Your Blog Title"
            className="border-2 dark:border-2 w-full p-4 mt-3 text-2xl"
          />
        </div>
        {/* subtitle */}
        <div className="mt-2">
          <Label className="text-2xl">SubTitle</Label>
          <input
            className="border-2 dark:border-2 w-full p-4 mt-3 text-2xl"
            type="text"
            placeholder="Enter blog subtitle"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
          />
        </div>
        {/* category */}
        <div className="mt-2">
          <Label className="text-2xl mb-4">Category</Label>
          <Select
            // value={category}
            onValueChange={getSelectedCategory}
            items={items}
          >
            <SelectTrigger className="w-full h-10 max-w-65 border-2  p-3 text-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-xl">Categories</SelectLabel>
                {items.map((item) => (
                  <SelectItem className="" key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3">
          <Button
            disabled={loading}
            onClick={createBlogHandler}
            className="h-12 text-2xl cursor-pointer w-[15%]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Please Wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateBlog;
