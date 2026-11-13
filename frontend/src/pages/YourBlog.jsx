import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setBlog } from "@/pages/redux/blogSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import {
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

const YourBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteBlog = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/v1/blog/delete/${id}`,
        { withCredentials: true, timeout: 15000 }
      );
      if (res.data.success) {
        setBlogs((current) => current.filter((blog) => blog?._id !== id));
        toast.add({
          title: "Blog deleted",
          description: "The article was removed successfully.",
          type: "success",
        });
      }
    } catch (error) {
      toast.add({
        title: "Could not delete blog",
        description:
          error.response?.data?.message || "Check your connection and try again.",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get("http://localhost:3000/api/v1/blog/your-blog", {
        withCredentials: true,
        timeout: 15000,
        signal: controller.signal,
      })
      .then((res) => {
        const loadedBlogs = res.data.blogs ?? res.data.blog;
        if (!Array.isArray(loadedBlogs)) {
          throw new Error("Invalid blogs response.");
        }
        setBlogs(loadedBlogs);
        dispatch(setBlog(loadedBlogs));
        setErrorMessage("");
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          setErrorMessage(
            error.response?.data?.message || "Could not load your blogs."
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [dispatch]);

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime())
      ? "Date unavailable"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return blogs;
    return blogs.filter(
      (b) =>
        b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Your Articles
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage, edit, and monitor your written posts and drafts.
          </p>
        </div>

        <Button
          onClick={() => navigate("/dashboard/create-blog")}
          size="sm"
          className="gap-2 shrink-0 shadow-sm"
        >
          <Plus className="size-4" />
          <span>Write New Blog</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your articles..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-card text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        </span>
      </div>

      {/* Main Table Card */}
      <Card className="border border-border/80 shadow-xs overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table className="w-full ">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[45%]">Article</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      Loading your library...
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {errorMessage && (
                <TableRow>
                  <TableCell colSpan={4} className="h-28 text-center text-sm text-destructive">
                    {errorMessage}
                  </TableCell>
                </TableRow>
              )}

              {!loading && !errorMessage && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-36 text-center text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">No articles found</p>
                    <p className="text-xs pt-1">
                      {searchTerm
                        ? "Try clearing your search query."
                        : "You haven't written any articles yet."}
                    </p>
                    {!searchTerm && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/dashboard/create-blog")}
                        className="mt-4 gap-1.5"
                      >
                        <Plus className="size-3.5" /> Start First Draft
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                !errorMessage &&
                filtered.map((item) => (
                  <TableRow key={item._id} className="hover:bg-muted/30 transition-colors">
                    {/* Article Column */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt="no pic"
                            className="size-12 rounded-lg object-cover shrink-0 border border-border"
                          />
                        ) : (
                          <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-[10px] text-muted-foreground shrink-0">
                            Draft
                          </div>
                        )}
                        <div className="min-w-0">
                          <span
                            onClick={() => navigate(`/blogs/${item._id}`)}
                            className="font-bold text-sm text-foreground hover:text-primary hover:underline cursor-pointer line-clamp-1 block"
                          >
                            {item.title || "Untitled blog"}
                          </span>
                          {item.subTitle && (
                            <p className="text-xs text-muted-foreground line-clamp-1 pt-0.5">
                              {item.subTitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Category Column */}
                    <TableCell>
                      <span className="inline-block text-[11px] font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                        {item.category || "General"}
                      </span>
                    </TableCell>

                    {/* Date Column */}
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => navigate(`/blogs/${item._id}`)}
                          title="View live article"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="size-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/dashboard/create-blog/${item._id}`)
                              }
                              className="cursor-pointer gap-2"
                            >
                              <Edit className="size-3.5" />
                              <span>Edit Story</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigate(`/blogs/${item._id}`)}
                              className="cursor-pointer gap-2"
                            >
                              <Eye className="size-3.5" />
                              <span>Preview</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteBlog(item._id)}
                              disabled={deletingId === item._id}
                              variant="destructive"
                              className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
export default YourBlog;
