import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/toast";

const YourBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const deleteBlog = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/v1/blog/delete/${id}`,
        { withCredentials: true, timeout: 15000 },
      );
      if (res.data.success) {
        setBlogs((currentBlogs) =>
          currentBlogs.filter((blog) => blog?._id !== id),
        );
        toast.add({
          title: "Blog deleted",
          description: "The blog was deleted successfully.",
          type: "success",
        });
      }
    } catch (error) {
      toast.add({
        title: "Could not delete blog",
        description:
          error.response?.data?.message ||
          "Check your connection and try again.",
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
          throw new Error("The server returned an invalid blogs list.");
        }
        setBlogs(loadedBlogs);
        setErrorMessage("");
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          setErrorMessage(
            error.response?.data?.message || "Could not load your blogs.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);
  // format date
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime())
      ? "Date unavailable"
      : date.toLocaleDateString("en-GB");
  };
  return (
    <div className="h-full min-h-0 p-3 pt-6 md:pl-6 md:pr-8">
      <Card className="flex h-full min-h-0 flex-col overflow-hidden p-4 dark:bg-gray-800">
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Your Blogs</h1>
          {!loading && !errorMessage && (
            <span className="text-sm text-muted-foreground">
              {blogs.length} {blogs.length === 1 ? "blog" : "blogs"}
            </span>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <Table className="w-full min-w-[560px]">
            <TableCaption>A list of your recent blogs.</TableCaption>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead className="min-w-[245px] pl-49">Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
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
              {loading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading your blogs...
                  </TableCell>
                </TableRow>
              )}
              {!loading && !errorMessage && blogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    You have not created any blogs yet.
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                !errorMessage &&
                blogs.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.thumbnail && (
                          <img
                            src={item.thumbnail}
                            alt=""
                            loading="lazy"
                            className="hidden h-25 w-35 rounded-md object-cover sm:block"
                          />
                        )}
                        <span className="max-w-[280px] truncate pl-10 font-medium">
                          {item.title || "Untitled blog"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{item.category || "Uncategorized"}</TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="outline" size="icon" />}
                          disabled={deletingId === item._id}
                          aria-label={`Actions for ${item.title || "blog"}`}
                        >
                          <BsThreeDotsVertical className="size-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="text-center">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/dashboard/create-blog/${item._id}`)
                              }
                              className="cursor-pointer"
                            >
                              <Edit />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => deleteBlog(item._id)}
                              disabled={Boolean(deletingId)}
                              className="cursor-pointer text-red-500"
                            >
                              <Trash2 />
                              {deletingId === item._id
                                ? "Deleting..."
                                : "Delete"}
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
