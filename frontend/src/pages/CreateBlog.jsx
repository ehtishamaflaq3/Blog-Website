import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
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
import axios from "axios";
import { setBlog, setLoading } from "@/redux/blogSlice";
import { toast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

// category items for displaying
const items = [
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
  const submitting = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog, loading } = useSelector((store) => store.blog);

  // toast function
  function showToast() {
    toast.add({
      title: "Blog Created Successfully",
      description: "Now Confirm and Publish",
      type: "success",
    });
  }

  // blog handler

  const createBlogHandler = async () => {
    if (submitting.current) return;
    if (!title.trim() || !subTitle.trim() || !category) {
      toast.add({
        title: "Complete all fields",
        description: "Enter a title and subtitle, and select a category.",
        type: "error",
      });
      return;
    }

    submitting.current = true;
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        "http://localhost:3000/api/v1/blog/create-blog",
        { title: title.trim(), category, subTitle: subTitle.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          timeout: 15000,
        },
      );
      if (res.data.success) {
        const existingBlogs = Array.isArray(blog) ? blog : [];
        dispatch(
          setBlog([
            ...existingBlogs.filter((item) => item._id !== res.data.blog._id),
            res.data.blog,
          ]),
        );
        navigate(`/dashboard/create-blog/${res.data.blog._id}`);
        showToast();
      }
    } catch (error) {
      toast.add({
        title: "Could not create blog",
        description:
          error.response?.data?.message ||
          (error.code === "ECONNABORTED"
            ? "The server took too long to respond. Please try again."
            : "Check that the backend server is running and try again."),
        type: "error",
      });
    } finally {
      submitting.current = false;
      dispatch(setLoading(false));
    }
  };
  // getting category value
  const getSelectedCategory = (value) => {
    setCategory(value);
  };
  return (
    <div className=" md:pr-3 h-screen md:ml-[50px] pt-5">
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
            value={category}
            onValueChange={getSelectedCategory}
            items={items}
          >
            <SelectTrigger className="w-full h-10 max-w-65 border-2  p-3 text-2xl">
              <SelectValue placeholder="Select a category" />
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
            type="button"
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
