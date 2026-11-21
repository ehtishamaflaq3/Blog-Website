import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import {
  CheckCircle,
  ExternalLink,
  ThumbsUp,
  Trash2,
} from "lucide-react";

const Comments = () => {
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get("/comment/my", {
        withCredentials: true,
        signal: controller.signal,
      })
      .then((res) => {
        if (!Array.isArray(res.data.comments)) {
          throw new Error("Invalid comments response.");
        }
        setCommentList(
          res.data.comments.map((comment) => {
            const author = comment.authorId;
            return {
              id: comment._id,
              author:
                `${author?.firstName || ""} ${author?.lastName || ""}`.trim() ||
                "Unknown User",
              avatar: author?.photoUrl || "",
              content: comment.content,
              blogTitle: comment.blogId?.title || "Unavailable story",
              blogId: comment.blogId?._id,
              time: comment.createdAt
                ? new Date(comment.createdAt).toLocaleString()
                : "Time unavailable",
              likes: comment.numberOfLikes || 0,
            };
          }),
        );
        setLoadError("");
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          setLoadError(
            error.response?.data?.message || "Could not load comments.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const handleDelete = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(
        `/comment/${id}/delete`,
        { withCredentials: true },
      );
      if (res.data.success) {
        setCommentList((prev) => prev.filter((comment) => comment.id !== id));
        toast.add({
          title: "Comment removed",
          description: "The comment has been deleted from your story.",
          type: "success",
        });
      }
    } catch (error) {
      toast.add({
        title: "Could not delete comment",
        description:
          error.response?.data?.message || "Please try again.",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Comments & Feedback
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review and engage with discussions left on your published stories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {commentList.length} Total Feedback
          </span>
        </div>
      </div>

      {loadError && (
        <Card className="p-4 border border-destructive/20 bg-destructive/5">
          <p className="text-sm text-destructive">{loadError}</p>
        </Card>
      )}

      {loading ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Loading comments...
        </Card>
      ) : commentList.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 bg-muted/20">
          <CheckCircle className="size-10 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-base font-bold text-foreground">
            All caught up!
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            You don't have any pending comments to moderate.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {commentList.map((item) => (
            <Card
              key={item.id}
              className="p-3 border border-border/80 bg-card hover:shadow-xs transition-shadow space-y-1"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={item.avatar} alt={item.author} />
                    <AvatarFallback className="text-xs">
                      {item.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-none">
                      {item.author}
                    </h4>
                    <p className="text-[11px] text-muted-foreground pt-1">
                      {item.time}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleDelete(item.id)}
                  disabled={Boolean(deletingId)}
                  title="Delete comment"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              <p className="text-sm text-foreground/90 leading-relaxed pl-12">
                "{item.content}"
              </p>

              <div className="pl-12 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px]">On story:</span>
                  {item.blogId ? (
                    <Link
                      to={`/blogs/${item.blogId}`}
                      className="font-medium text-foreground inline-flex items-center gap-1"
                    >
                      {item.blogTitle}
                      <ExternalLink className="size-3" />
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground">
                      {item.blogTitle}
                    </span>
                  )}
                </div>

                <span className="flex items-center gap-1 text-[11px]">
                  <ThumbsUp className="size-3" /> {item.likes} likes
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
