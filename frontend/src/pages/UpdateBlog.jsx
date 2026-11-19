import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import JodeEditor from "jodit-react";
import { setBlog, setLoading } from "@/pages/redux/blogSlice";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import {
  ArrowLeft,
  Eye,
  ImageIcon,
  Loader2,
  Save,
  Sparkles,
  Upload,
} from "lucide-react";

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
  const params = useParams();
  const id = params.blogId;

  const { blog, loading } = useSelector((store) => store.blog);
  const { theme } = useSelector((store) => store.theme);
  const [selectBlog, setSelectBlog] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [content, setContent] = useState("");
  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    category: "",
  });
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const editorConfig = useMemo(
    () => ({
      theme: theme === "dark" ? "dark" : "default",
      style: {
        color: theme === "dark" ? "#ffffff" : "#000000",
        backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
      },
    }),
    [theme],
  );

  useEffect(() => {
    let isMounted = true;

    const loadBlog = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/blog/${id}`,
          { withCredentials: true, timeout: 15000 }
        );
        if (!isMounted) return;

        const loadedBlog = res.data.blog;
        setSelectBlog(loadedBlog);
        setBlogData({
          title: loadedBlog.title || "",
          subtitle: loadedBlog.subTitle || "",
          category: loadedBlog.category || "",
        });
        setContent(loadedBlog.description || "");
        setPreviewThumbnail(loadedBlog.thumbnail || "");
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error.response?.data?.message || "Could not load this blog."
          );
        }
      }
    };

    loadBlog();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const updateBlogHandler = async () => {
    if (!blogData.title.trim() || !blogData.subtitle.trim() || !blogData.category) {
      toast.add({
        title: "Required fields missing",
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
    if (thumbnailFile instanceof File) {
      formData.append("file", thumbnailFile);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        `http://localhost:3000/api/v1/blog/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
          timeout: 20000,
        }
      );

      if (res.data.success) {
        const existingBlogs = Array.isArray(blog) ? blog : [];
        dispatch(
          setBlog([
            ...existingBlogs.filter((item) => item._id !== id),
            res.data.blog,
          ])
        );
        setSelectBlog(res.data.blog);
        toast.add({
          title: "Story Updated!",
          description: "Your changes have been saved successfully.",
          type: "success",
        });
        navigate("/dashboard/your-blog");
      }
    } catch (error) {
      toast.add({
        title: "Could not update blog",
        description:
          error.response?.data?.message || "Something went wrong while saving.",
        type: "error",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loadError) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <Card className="p-8 border-destructive/20 bg-destructive/5">
          <p className="text-destructive font-semibold">{loadError}</p>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/your-blog")}
            className="mt-4"
          >
            Back to Your Blogs
          </Button>
        </Card>
      </div>
    );
  }

  if (!selectBlog) {
    return (
      <div className="p-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-primary" />
        <span>Loading story editor...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl">
      {/* Sticky Top Header / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate max-w-md">
              Editing: {blogData.title || "Untitled story"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Make changes below and hit save to publish updates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/blogs/${id}`)}
            className="gap-1.5 text-xs"
          >
            <Eye className="size-3.5" />
            <span>Preview Live</span>
          </Button>

          <Button
            disabled={loading}
            onClick={updateBlogHandler}
            size="sm"
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor & Metadata Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Title, Subtitle, & Rich Body */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-5 sm:p-6 border border-border/80 bg-card space-y-5">
            {/* Title Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Headline
              </Label>
              <input
                type="text"
                name="title"
                value={blogData.title}
                onChange={handleChange}
                placeholder="Story headline..."
                className="w-full text-lg sm:text-xl font-bold h-12 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Subtitle Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Subtitle
              </Label>
              <input
                type="text"
                name="subtitle"
                value={blogData.subtitle}
                onChange={handleChange}
                placeholder="Story summary or dek..."
                className="w-full text-sm h-10 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-muted-foreground"
              />
            </div>

            {/* Jodit Rich Text Editor */}
            <div className="space-y-1.5 pt-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Article Body Content
              </Label>
              <div className="rounded-xl overflow-hidden border border-border">
                <JodeEditor
                  ref={editor}
                  value={content}
                  config={editorConfig}
                  onChange={(newContent) => setContent(newContent)}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Sidebar Settings (Category & Thumbnail) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category Card */}
          <Card className="p-5 border border-border/80 bg-card space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              Topic & Track
            </h3>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select
                value={blogData.category}
                onValueChange={(val) =>
                  setBlogData((prev) => ({ ...prev, category: val }))
                }
              >
                <SelectTrigger className="w-full h-10 border border-border bg-background text-xs sm:text-sm">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-xs">Categories</SelectLabel>
                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Cover Thumbnail Card */}
          <Card className="p-5 border border-border/80 bg-card space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              Cover Thumbnail
            </h3>

            {previewThumbnail ? (
              <div className="space-y-3">
                <div className="overflow-hidden rounded-xl aspect-video border border-border/80 bg-muted">
                  <img
                    src={previewThumbnail}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="cover-upload"
                  className="w-full h-9 rounded-lg border border-border bg-muted/40 hover:bg-muted text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Upload className="size-3.5" />
                  <span>Change Image</span>
                </label>
              </div>
            ) : (
              <label
                htmlFor="cover-upload"
                className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-border/80 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors p-4 text-center space-y-2"
              >
                <ImageIcon className="size-8 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">
                  Upload Cover Photo
                </span>
                <span className="text-[10px] text-muted-foreground">
                  PNG, JPG, or WEBP up to 5MB
                </span>
              </label>
            )}

            <input
              type="file"
              id="cover-upload"
              accept="image/*"
              onChange={selectThumbnail}
              className="hidden"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlog;
