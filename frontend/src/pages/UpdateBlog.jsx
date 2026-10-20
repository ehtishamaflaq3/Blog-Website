import { useEffect, useRef, useState } from "react";
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
import { setBlog, setLoading } from "@/redux/blogSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

const items = [
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

  // Load the selected blog from the API so editing also works after a refresh.
  const { blog, loading } = useSelector((store) => store.blog);
  const [selectBlog, setSelectBlog] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [content, setContent] = useState("");
  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
  });
  const [previewThumbnail, setPreviewThumbnail] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadBlog = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/blog/${id}`,
          { withCredentials: true, timeout: 15000 },
        );
        if (!isMounted) return;

        const loadedBlog = res.data.blog;
        setSelectBlog(loadedBlog);
        setBlogData({
          title: loadedBlog.title || "",
          subtitle: loadedBlog.subTitle || "",
          description: loadedBlog.description || "",
          category: loadedBlog.category || "",
        });
        setContent(loadedBlog.description || "");
        setPreviewThumbnail(loadedBlog.thumbnail || "");
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error.response?.data?.message || "Could not load this blog.",
          );
        }
      }
    };

    loadBlog();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // set all change data in blog section
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // selecting category
  const selectCategory = (value) => {
    setBlogData((previous) => ({ ...previous, category: value }));
  };

  // selecting thumbnail
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData((previous) => ({ ...previous, thumbnail: file }));
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
    if (!blogData.title.trim() || !blogData.subtitle.trim() || !blogData.category) {
      toast.add({
        title: "Complete all fields",
        description: "Title, subtitle, and category are required.",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("subTitle", blogData.subtitle);
    formData.append("description", content);
    formData.append("category", blogData.category);
    if (blogData.thumbnail instanceof File) {
      formData.append("file", blogData.thumbnail);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        `http://localhost:3000/api/v1/blog/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
          timeout: 15000,
        },
      );
      if (res.data.success) {
        const existingBlogs = Array.isArray(blog) ? blog : [];
        dispatch(
          setBlog([
            ...existingBlogs.filter((item) => item._id !== id),
            res.data.blog,
          ]),
        );
        setSelectBlog(res.data.blog);
        showToast();
        navigate('/dashboard/your-blog');
      }
    } catch (error) {
      toast.add({
        title: "Could not update blog",
        description:
          error.response?.data?.message ||
          "Check that the backend server is running and try again.",
        type: "error",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loadError) {
    return <div className="p-6 text-red-500">{loadError}</div>;
  }
  if (!selectBlog) {
    return <div className="p-6">Loading blog...</div>;
  }

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
            value={content}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>
        {/* categories */}
        <div>
          <Label className="text-xl mb-1">Category</Label>
          <Select
            onValueChange={selectCategory}
            value={blogData?.category}
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
            onChange={selectThumbnail}
            accept="image/*"
            className="dark:border-gray-300 text-xl border-2 border-gray-500 rounded-xl h-12 w-85 p-2"
          />
          {previewThumbnail && (
            <img
              src={previewThumbnail}
              alt="error"
              className="w-90 h-70 my-2"
            />
          )}
        </div>
        {/* back and save */}
        <div className="flex gap-5">
          <Button
            onClick={() => navigate(-1)}
            className="w-45 p-3 text-2xl h-13"
            variant="outline"
          >
            Back
          </Button>
          <Button
            disabled={loading}
            onClick={updateBlogHandler}
            className="w-45 p-3 text-2xl h-13"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                please wait
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default UpdateBlog;
