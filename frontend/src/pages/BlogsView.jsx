import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  ArrowLeft,
  ArrowUp,
  Bookmark,
  Calendar,
  Check,
  Clock,
  Copy,
  Edit3,
  Heart,
  MessageSquare,
  Send,
  Share2,
  Sparkles,
  User,
  ThumbsUp,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";

const getReadableDescription = (description, theme) => {
  if (!description || theme !== "dark") return description;

  const parsedDescription = new DOMParser().parseFromString(
    description,
    "text/html",
  );
  parsedDescription.body
    .querySelectorAll("[style], [color]")
    .forEach((node) => {
      const color = node.style.color || node.getAttribute("color");
      if (!color) return;

      const colorProbe = document.createElement("span");
      colorProbe.style.color = color;
      if (colorProbe.style.color === "rgb(0, 0, 0)") {
        node.style.color = "#ffffff";
        node.removeAttribute("color");
      }
    });

  return parsedDescription.body.innerHTML;
};

const BlogsView = () => {
  const params = useParams();
  const blogId = params.blogId;
  const navigate = useNavigate();

  // Redux state
  const { blog: blogsList } = useSelector((store) => store.blog);
  const { user: currentUser } = useSelector((store) => store.auth);
  const { theme } = useSelector((store) => store.theme);

  // Initial blog from redux cache if present
  const cachedBlog = blogsList?.find(
    (item) =>
      String(item._id) === String(blogId) &&
      (item.isPublished !== false ||
        String(item.author?._id || item.author) === String(currentUser?._id)),
  );
  // Component state
  const [blogData, setBlogData] = useState(() => cachedBlog || null);
  const [loading, setLoading] = useState(() => !cachedBlog);
  const [error, setError] = useState("");
  const articleDescription = useMemo(
    () => getReadableDescription(blogData?.description, theme),
    [blogData?.description, theme],
  );

  // Reading progress
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Interactive article states
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    () => cachedBlog?.likes?.length || 0,
  );

  const [isLiking, setIsLiking] = useState(false);
  useEffect(() => {
    if (!blogData) return;
    const likes = blogData.likes || [];
    setLikeCount(likes.length);
    const userHasLiked = likes.some((like) => {
      const likedUserId = like && typeof like === "object" ? like._id : like;

      return String(likedUserId) === String(currentUser?._id);
    });
    setIsLiked(userHasLiked);
  }, [blogData, currentUser?._id]);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Comment section state
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  // Fetch comments of current blog
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `/comment/${blogId}/comment/all`,
          { withCredentials: true },
        );
        if (res.data.success) {
          const formattedComments = res.data.comments.map((comment) => {
            const author = comment.authorId;
            return {
              id: comment._id,
              authorId: author?._id,
              author:
                `${author?.firstName || ""} ${author?.lastName || ""}`.trim() ||
                "Unknown User",
              avatar: author?.photoUrl || "",
              content: comment.content,
              time: new Date(comment.createdAt).toLocaleString(),
              likes: comment.numberOfLikes || 0,
              isLiked:
                comment.likes?.some(
                  (id) => String(id?._id || id) === String(currentUser?._id),
                ) || false,
            };
          });
          setComments(formattedComments);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setComments([]);
        } else {
          console.log("FETCH COMMENTS ERROR:", error);
        }
      }
    };
    if (blogId) {
      fetchComments();
    }
  }, [blogId, currentUser?._id]);
  // comment edit id
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);

  // Handle scroll progress and scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(
          100,
          Math.max(0, (scrollY / totalHeight) * 100),
        );
        setReadingProgress(progress);
      }
      setShowScrollTop(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch blog data
  useEffect(() => {
    let isMounted = true;

    // Fetch latest data from backend to ensure all details and fresh description
    const fetchBlog = async () => {
      try {
        let res;
        try {
          res = await axios.get(
            `/blog/${blogId}`,
            { withCredentials: true, timeout: 15000 },
          );
        } catch (error) {
          if (error.response?.status !== 404 || !currentUser?._id) {
            throw error;
          }
          res = await axios.get(
            `/blog/my/${blogId}`,
            { withCredentials: true, timeout: 15000 },
          );
        }
        if (isMounted && res.data.success && res.data.blog) {
          setBlogData(res.data.blog);
          setLikeCount(res.data.blog.likes?.length || 0);
          setError("");
        }
      } catch (err) {
        if (!cachedBlog && isMounted) {
          setError(
            err.response?.data?.message ||
              "Blog not found or could not be loaded.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlog();
    return () => {
      isMounted = false;
    };
  }, [blogId, cachedBlog, currentUser?._id]);

  // Date formatting helper
  const formatDate = (rawDate) => {
    if (!rawDate) return "Recently published";
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return "Recently published";
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Estimate read time based on word count
  const readTime = useMemo(() => {
    const desc = blogData?.description;
    if (!desc) return "3 min read";
    const plainText = desc.replace(/<[^>]*>/g, " ");
    const words = plainText.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  }, [blogData]);

  // Author details extraction
  const author = blogData?.author;
  const authorName = useMemo(() => {
    if (author && typeof author === "object") {
      const full = `${author.firstName || ""} ${author.lastName || ""}`.trim();
      if (full) return full;
    }
    if (
      currentUser &&
      (String(author) === String(currentUser._id) || !author)
    ) {
      const full =
        `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim();
      if (full) return full;
    }
    return "Staff Writer";
  }, [author, currentUser]);

  const authorPhoto = useMemo(() => {
    if (author && typeof author === "object" && author.photoUrl) {
      return author.photoUrl;
    }
    return "";
  }, [author]);

  const authorInitials = useMemo(() => {
    const parts = authorName.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return authorName.slice(0, 2).toUpperCase() || "AU";
  }, [authorName]);

  const isOwner = useMemo(() => {
    if (!currentUser || !blogData) return false;
    if (typeof author === "object" && author?._id) {
      return String(author._id) === String(currentUser._id);
    }
    return String(author) === String(currentUser._id);
  }, [currentUser, blogData, author]);

  // More blogs from store (excluding current)
  const relatedBlogs = useMemo(() => {
    if (!blogsList || !Array.isArray(blogsList)) return [];
    return blogsList
      .filter(
        (item) =>
          String(item._id) !== String(blogId) && item.isPublished !== false,
      )
      .slice(0, 3);
  }, [blogsList, blogId]);

  // Interactive handlers
  const handleLike = async () => {
    // Check whether user is logged in
    if (!currentUser) {
      toast.add({
        title: "Login required",
        description: "Please login to like this blog.",
        type: "error",
      });
      navigate("/login");
      return;
    }
    // Prevent multiple requests
    if (isLiking) return;
    try {
      setIsLiking(true);
      const res = await axios.post(
        `/blog/${blogId}/like`,
        {},
        { withCredentials: true },
      );
      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setLikeCount(res.data.likeCount);
        toast.add({
          title: res.data.isLiked ? "Liked this story!" : "Like removed",
          description: res.data.isLiked
            ? "Thank you for supporting the author."
            : "You unliked this post.",
          type: "success",
        });
      }
    } catch (error) {
      console.log("LIKE ERROR:", error);
      toast.add({
        title: "Something went wrong",
        description:
          error.response?.data?.message ||
          "Unable to update like. Please try again.",
        type: "error",
      });
    } finally {
      setIsLiking(false);
    }
  };
  const handleBookmark = () => {
    setIsBookmarked((prev) => {
      const next = !prev;
      toast.add({
        title: next ? "Saved to Bookmarks" : "Removed from Bookmarks",
        description: next
          ? "You can view your saved articles anytime."
          : "Article removed from your reading list.",
        type: "success",
      });
      return next;
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.add({
        title: "Link Copied!",
        description: "Blog link has been copied to your clipboard.",
        type: "success",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.add({
        title: "Could not copy",
        description: "Please copy the URL from your address bar.",
        type: "error",
      });
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    // Check if user is logged in
    if (!currentUser) {
      toast.add({
        title: "Login required",
        description: "Please login to comment.",
        type: "error",
      });
      navigate("/login");
      return;
    }
    // Prevent empty comments
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(
        `/comment/${blogId}/create`,
        {
          content: commentText,
        },
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        const savedComment = res.data.comment;
        // Format the saved comment for frontend
        const newComment = {
          id: savedComment._id,
          authorId: currentUser._id,
          author:
            `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
            "You",
          avatar: currentUser.photoUrl || "",
          content: savedComment.content,
          time: new Date(savedComment.createdAt).toLocaleString(),
          likes: 0,
          isLiked: false,
        };
        // Show new comment at the top
        setComments((prev) => [newComment, ...prev]);
        // Clear input
        setCommentText("");
        toast.add({
          title: "Comment published",
          description: res.data.message,
          type: "success",
        });
      }
    } catch (error) {
      console.log("ADD COMMENT ERROR:", error);
      toast.add({
        title: "Unable to post comment",
        description: error.response?.data?.message || "Please try again.",
        type: "error",
      });
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) {
      toast.add({
        title: "Empty comment",
        description: "Comment cannot be empty.",
        type: "error",
      });
      return;
    }

    try {
      setIsEditingComment(true);

      const res = await axios.put(
        `/comment/${commentId}/edit`,
        {
          content: editCommentText,
        },
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  content: res.data.comment.content,
                  time: new Date(res.data.comment.updatedAt).toLocaleString(),
                }
              : comment,
          ),
        );

        setEditingCommentId(null);
        setEditCommentText("");

        toast.add({
          title: "Comment updated",
          description: res.data.message,
          type: "success",
        });
      }
    } catch (error) {
      console.log("EDIT COMMENT ERROR:", error);

      toast.add({
        title: "Unable to update comment",
        description: error.response?.data?.message || "Please try again.",
        type: "error",
      });
    } finally {
      setIsEditingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `/comment/${commentId}/delete`,
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId),
        );
        toast.add({
          title: "Comment deleted",
          description: res.data.message,
          type: "success",
        });
      }
    } catch (error) {
      console.log("DELETE COMMENT ERROR:", error);
      toast.add({
        title: "Unable to delete comment",
        description: error.response?.data?.message || "Please try again.",
        type: "error",
      });
    }
  };
  const handleLikeComment = async (commentId) => {
    if (!currentUser) {
      toast.add({
        title: "Login required",
        description: "Please login to like a comment.",
        type: "error",
      });

      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        `/comment/${commentId}/like`,
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes: res.data.numberOfLikes,
                  isLiked: res.data.isLiked,
                }
              : comment,
          ),
        );
      }
    } catch (error) {
      console.log("LIKE COMMENT ERROR:", error);

      toast.add({
        title: "Unable to like comment",
        description: error.response?.data?.message || "Please try again.",
        type: "error",
      });
    }
  };
  const scrollToComments = () => {
    const el = document.getElementById("comments-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading skeleton screen
  if (loading) {
    return (
      <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
          <div className="h-5 w-48 bg-muted rounded-md" />
          <div className="space-y-4">
            <div className="h-6 w-28 bg-muted rounded-full" />
            <div className="h-12 w-3/4 bg-muted rounded-lg" />
            <div className="h-6 w-1/2 bg-muted rounded-md" />
          </div>
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-36 bg-muted rounded-md" />
              <div className="h-3 w-48 bg-muted rounded-md" />
            </div>
          </div>
          <div className="h-105 w-full bg-muted rounded-2xl" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Error / Not Found state
  if (error || !blogData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="max-w-lg w-full text-center p-8 border border-border shadow-lg">
          <div className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
            <Sparkles className="size-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Story Not Found
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {error ||
              "The article you're looking for doesn't exist, has been removed, or is currently unpublished."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="size-4" /> Go Back
            </Button>
            <Button
              onClick={() => navigate("/dashboard/your-blog")}
              className="gap-2"
            >
              Your Blogs
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 bg-linear-to-r from-gray-800 via-gray-500 to-gray-200 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />
      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-2">
        {/* Navigation & Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <Breadcrumb>
            <BreadcrumbList className="text-xs sm:text-sm">
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link to="/blogs" />}>
                  Blogs
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-55 sm:max-w-xs truncate font-medium">
                  {blogData.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="w-fit text-muted-foreground hover:text-foreground hover:bg-muted/60 text-xs sm:text-sm gap-1.5"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>

        {/* Article Header */}
        <header className="space-y-6 mb-4">
          {/* Category Pill & Status */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 shadow-xs">
              {blogData.category || "General"}
            </span>
            <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 rounded-md bg-muted">
              {blogData.isPublished !== false ? "Published" : "Draft"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {blogData.title}
          </h1>

          {/* Subtitle / Dek */}
          {blogData.subTitle && (
            <p className="text-lg sm:text-xl text-muted-foreground font-normal leading-relaxed">
              {blogData.subTitle}
            </p>
          )}

          {/* Author & Publication Metadata Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-y border-border/60 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-14 border-2 shadow-sm transition-transform hover:scale-105">
                <AvatarImage src={authorPhoto} alt={authorName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-base tracking-tight hover:underline cursor-pointer">
                  {authorName}
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3" />
                    {formatDate(blogData.createdAt)}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {readTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/create-blog/${blogId}`)}
                  className="gap-1.5 text-xs font-medium hover:border-primary/50"
                >
                  <Edit3 className="size-3.5 text-primary" />
                  Edit Story
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleBookmark}
                title={isBookmarked ? "Remove Bookmark" : "Bookmark Story"}
                className={`transition-colors ${
                  isBookmarked
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bookmark
                  className={`size-4 ${isBookmarked ? "fill-primary" : ""}`}
                />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleCopyLink}
                title="Copy Story Link"
                className="text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <Share2 className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Thumbnail */}
        {blogData.thumbnail && (
          <div className="mb-10">
            <div className="overflow-hidden rounded-2xl border border-border/80 shadow-xl bg-muted/30 group">
              <img
                src={blogData.thumbnail}
                alt={blogData.title}
                className="w-full max-h-130 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />
            </div>
            {blogData.subTitle && (
              <p className="mt-2.5 text-center text-xs text-muted-foreground italic">
                {blogData.subTitle}
              </p>
            )}
          </div>
        )}

        {/* Article Body Content */}
        <article className="mb-2">
          {blogData.description ? (
            <div
              className="blog-article-content min-w-0 w-full max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: articleDescription }}
            />
          ) : (
            <Card className="p-8 text-center border-dashed border-2 bg-muted/10">
              <p className="text-muted-foreground text-sm">
                This story doesn't have any body text yet. Stay tuned for
                updates from the author!
              </p>
            </Card>
          )}
        </article>
        <Separator className="my-2" />
        {/* Discussion / Comments Section */}
        <section id="comments-section" className="mb-14 scroll-mt-12">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold tracking-tight">Discussion</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                {comments.length}
              </span>
            </div>
          </div>
          {/* Comment Form */}
          <Card className="p-2 sm:p-2 border border-border/80 shadow-xs mb-2">
            <form onSubmit={handleAddComment} className="space-y-2">
              <div className="flex items-start gap-3">
                <Avatar className="size-12 shrink-0 ring-1 ring-border">
                  <AvatarImage
                    src={currentUser?.photoUrl}
                    alt={currentUser?.firstName || "You"}
                  />
                  <AvatarFallback className="text-xs">
                    {currentUser?.firstName ? (
                      currentUser.firstName[0]
                    ) : (
                      <User className="size-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts on this story..."
                    rows={3}
                    className=" text-sm"
                  />
                </div>
              </div>
              {/* buttons */}
              <div className="flex justify-end pt-2 gap-2">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`gap-2 transition-all ${
                      isLiked
                        ? "bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
                        : "hover:text-rose-600"
                    }`}
                  >
                    <Heart
                      className={`size-4 transition-transform ${
                        isLiked ? "fill-white" : ""
                      }`}
                    />
                    <span className="font-semibold">{likeCount}</span>
                    <span className="hidden sm:inline">
                      {likeCount === 1 ? "Like" : "Likes"}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollToComments}
                    className="gap-2 hover:text-primary"
                  >
                    <MessageSquare className="size-4" />
                    <span>{comments.length}</span>
                    <span className="hidden sm:inline">Comments</span>
                  </Button>
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!commentText.trim()}
                  className="gap-1.5"
                >
                  <Send className="size-3.5" />
                  Post Comment
                </Button>
              </div>
            </form>
          </Card>
          {/* Comment List */}
          <div className="space-y-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-2 rounded-xl border border-border/60 bg-card/40 space-y-2 transition-all hover:bg-card/70"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage src={comment.avatar} alt={comment.author} />
                      <AvatarFallback className="text-xs">
                        {comment.author?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {comment.author}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {comment.time}
                      </p>
                    </div>
                  </div>
                  {String(comment.authorId) === String(currentUser?._id) && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditClick(comment)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-sm font-medium text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                {editingCommentId === comment.id ? (
                  <div className="mt-3 space-y-3">
                    <textarea
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Edit your comment..."
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={isEditingComment || !editCommentText.trim()}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isEditingComment ? "Saving..." : "Save"}
                      </button>

                      <button
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditCommentText("");
                        }}
                        disabled={isEditingComment}
                        className="rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-foreground">{comment.content}</p>
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        comment.isLiked
                          ? "text-red-500"
                          : "text-muted-foreground hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`size-4 ${
                          comment.isLiked ? "fill-current" : ""
                        }`}
                      />

                      <span>{comment.likes || 0}</span>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Back to Top"
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-all duration-300 hover:scale-110 z-40 focus:outline-none"
        >
          <ArrowUp className="size-5" />
        </button>
      )}

      {/* Rich Article Typography Scoped Styles */}
      <style>{`
        .blog-article-content {
          font-size: 1.125rem;
          line-height: 1.85;
          letter-spacing: -0.01em;
          color: var(--foreground);
        }
        .blog-article-content p {
          margin-bottom: 1.6rem;
        }
        .blog-article-content h1,
        .blog-article-content h2,
        .blog-article-content h3,
        .blog-article-content h4,
        .blog-article-content h5,
        .blog-article-content h6 {
          color: var(--foreground);
          font-weight: 700;
          line-height: 1.3;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          letter-spacing: -0.025em;
        }
        .blog-article-content h1 { font-size: 2.25rem; }
        .blog-article-content h2 { 
          font-size: 1.75rem; 
          border-bottom: 1px solid var(--border); 
          padding-bottom: 0.5rem; 
        }
        .blog-article-content h3 { font-size: 1.4rem; }
        .blog-article-content h4 { font-size: 1.15rem; }
        .blog-article-content blockquote {
          border-left: 4px solid var(--primary);
          padding: 0.85rem 1.4rem;
          margin: 2rem 0;
          font-style: italic;
          background: color-mix(in oklch, var(--muted) 45%, transparent);
          border-radius: 0 0.5rem 0.5rem 0;
          color: var(--muted-foreground);
        }
        .blog-article-content ul {
          list-style-type: disc;
          padding-left: 1.85rem;
          margin-bottom: 1.6rem;
        }
        .blog-article-content ol {
          list-style-type: decimal;
          padding-left: 1.85rem;
          margin-bottom: 1.6rem;
        }
        .blog-article-content li {
          margin-bottom: 0.5rem;
        }
        .blog-article-content img {
          border-radius: 0.875rem;
          max-width: 100%;
          height: auto;
          margin: 2.2rem auto;
          display: block;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--border);
        }
        .blog-article-content a {
          color: var(--primary);
          text-decoration: underline;
          text-underline-offset: 4px;
          font-weight: 500;
          transition: opacity 0.2s;
        }
        .blog-article-content a:hover {
          opacity: 0.8;
        }
        .blog-article-content code {
          background-color: var(--muted);
          padding: 0.2rem 0.45rem;
          border-radius: 0.375rem;
          font-size: 0.9em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .blog-article-content pre {
          background-color: #1e1e2e;
          color: #cdd6f4;
          padding: 1.25rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 2rem 0;
          font-size: 0.925rem;
          line-height: 1.6;
        }
        .blog-article-content pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        .blog-article-content hr {
          margin: 2.5rem 0;
          border-color: var(--border);
        }
      `}</style>
    </div>
  );
};
export default BlogsView;
