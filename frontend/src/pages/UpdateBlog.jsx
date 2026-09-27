import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import JodeEditor from "jodit-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";

const items = [
  { label: "Select a category", value: null },
  { label: "Web Development", value: "Web Development" },
  { label: "Digital Marketing", value: "Digital Marketing" },
  { label: "Blogging", value: "Blogging" },
  { label: "Photography", value: "Photography" },
  { label: "Cooking", value: "Cooking" },
];

const UpdateBlog = () => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // taking id of the blog
  const params = useParams();
  const id = params.blogId;
  // taking all data of blog from store
  const { blog } = useSelector((store) => store.blog);
  const selectBlog = blog?.find((blog) => blog._id === id);
  if (!selectBlog) {
  return <div>Blog not found...</div>;
}
  const [content, setContent] = useState(selectBlog.description || "");
  const [blogData, setBlogData] = useState({
    title: selectBlog?.title || "",
    subtitle: selectBlog?.subTitle || "",
    description: selectBlog?.description || "",
    category: selectBlog?.category || "",
  });
  const [previewThumbnail, setPreviewThumbnail] = useState(
    selectBlog?.thumbnail,
  );
  // set all change data in blog section
  const handleChange = (e) => {
    const { name, value } = e.target.value;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // selecting category
  const selectCategory = (value) => {
    setBlogData({ ...blogData, category: value });
  };
  // selecting thumbnail
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData({ ...blogData, thumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };
  // toast of update
  function showToast() {
    toast.add({
      title: "Blog Updated Successfully",
      description: "",
      type: "success",
    });
  }
  //updating all blog data
  const updateBlogHandler = async () => {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle);
    formData.append("description", content);
    formData.append("category", blogData.category);
    formData.append("file", blogData.thumbnail);
    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        `http://localhost:3000/api/v1/blog/create-blog${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        console.log(blogData);
        showToast();
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div className="md:pr-8 md:ml-[40px] pt-6">
      <Card className="h-[calc(100vh-80px)] overflow-y-auto p-4 dark:bg-gray-800 ">
        <h1 className="text-2xl font-bold">Basic Blog Information </h1>
        <p className="text-xl">
          Make changes to your blogs here. Click publish when you are done
        </p>
        {/* buttons */}
        <div className="space-x-6">
          <Button className="text-xl cursor-pointer h-12 w-35 font-bold">
            Public
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer text-xl h-12 w-35 font-bold"
          >
            Remove Blog
          </Button>
        </div>
        {/* input sections */}
        <div className="space-y-2">
          <Label className="text-xl">Title</Label>
          <input
            className="dark:border-gray-300 text-xl border-2 border-gray-500 rounded-xl h-12 w-85 p-2"
            type="text"
            name="title"
            value={blogData.title}
            onChange={handleChange}
            placeholder="Enter a title"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-xl">Subtitle</Label>
          <input
            type="text"
            className="dark:border-gray-300 text-xl border-2 border-gray-500 rounded-xl h-12 w-85 p-2"
            name="subtitle"
            value={blogData.subtitle}
            onChange={handleChange}
            placeholder="Enter a subtitle"
          />
        </div>
        {/* jodit editor */}
        <div className="space-y-2">
          <Label className="text-xl">Description</Label>
          <JodeEditor
            ref={editor}
            className="jodit- toolbar"
            value={blogData?.description || ""}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>
        {/* categories */}
        <div>
          <Label className="text-xl mb-1">Category</Label>
          <Select
            // value={category}
            items={items}
          >
            <SelectTrigger className="w-full h-10 max-w-65 border-2 p-3 text-2xl">
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
        {/* thumbnail */}
        <div className="space-y-1">
          <Label className="text-xl ">Thumbnail</Label>
          <input
            type="file"
            id="file"
            accept="image/*"
            className="dark:border-gray-300 text-xl border-2 border-gray-500 rounded-xl h-12 w-85 p-2"
          />
        </div>
        {/* back and save */}
        <div className="flex gap-5">
          <Button
            onClick={() => navigate(-1)}
            className="w-30 p-3 text-2xl h-13"
            variant="outline"
          >
            Back
          </Button>
          <Button className="w-30 p-3 text-2xl h-13">Save</Button>
        </div>
      </Card>
    </div>
  );
};
export default UpdateBlog;
