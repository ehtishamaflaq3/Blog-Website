import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
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
import { ArrowRight, Feather, Loader2, Sparkles, Tag } from "lucide-react";

const categories = [
  { label: "Web Development", value: "Web Development" },
  { label: "Digital Marketing", value: "Digital Marketing" },
  { label: "Blogging", value: "Blogging" },
  { label: "Photography", value: "Photography" },
  { label: "Cooking", value: "Cooking" },
];

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("");
  const submitting = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog, loading } = useSelector((store) => store.blog);

  const createBlogHandler = async (e) => {
    e.preventDefault();
    if (submitting.current) return;

    if (!title.trim() || !subTitle.trim() || !category) {
      toast.add({
        title: "Required fields missing",
        description: "Please enter a title, subtitle, and select a category.",
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
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          timeout: 15000,
        }
      );

      if (res.data.success) {
        const existing = Array.isArray(blog) ? blog : [];
        dispatch(
          setBlog([
            ...existing.filter((item) => item._id !== res.data.blog._id),
            res.data.blog,
          ])
        );

        toast.add({
          title: "Draft Created!",
          description: "Now add your rich content and cover image.",
          type: "success",
        });

        navigate(`/dashboard/create-blog/${res.data.blog._id}`);
      }
    } catch (error) {
      toast.add({
        title: "Could not create blog",
        description:
          error.response?.data?.message ||
          "Please verify that the backend server is running and try again.",
        type: "error",
      });
    } finally {
      submitting.current = false;
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="p-2 sm:p-5 lg:p-4 max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Start a New Story
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Give your piece a compelling title, a short synopsis, and choose its track.
        </p>
      </div>

      {/* Main Creation Card */}
      <Card className="p-4 sm:p-3 border border-border/80 bg-card shadow-xs space-y-4">
        <form onSubmit={createBlogHandler} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center justify-between">
              <span>Story Title</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {title.length}/100
              </span>
            </Label>
            <input
              type="text"
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Modern Web Architecture Patterns for 2026"
              className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Subtitle Field */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center justify-between">
              <span>Subtitle / Dek</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {subTitle.length}/180
              </span>
            </Label>
            <textarea
              value={subTitle}
              maxLength={180}
              rows={3}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="A brief hook explaining what readers will learn from your writeup..."
              className="w-full p-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <Tag className="size-3.5 text-muted-foreground" />
              <span>Category</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full h-11 border border-border bg-background text-sm">
                <SelectValue placeholder="Select a topic track..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-xs">Available Topics</SelectLabel>
                  {categories.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-border/50 flex items-center justify-end gap-3">
            <Button
              type="submit"
              disabled={loading || !title.trim() || !subTitle.trim() || !category}
              className="gap-2 px-5 font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <span>Continue to Editor</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateBlog;
