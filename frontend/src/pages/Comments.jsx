import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import {
  MessageSquare,
  ThumbsUp,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const initialComments = [
  {
    id: 1,
    author: "Sara Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    content: "The breakdown of state management in React 19 was super helpful. Loved the visual diagrams!",
    blogTitle: "Deep Dive into Modern Web Architectures",
    blogId: "1",
    time: "2 hours ago",
    likes: 5,
  }
];

const Comments = () => {
  const { blog } = useSelector((store) => store.blog);
  const [commentList, setCommentList] = useState(initialComments);
  const [filter, setFilter] = useState("all");

  const handleDelete = (id) => {
    setCommentList((prev) => prev.filter((c) => c.id !== id));
    toast.add({
      title: "Comment removed",
      description: "The comment has been deleted from your story.",
      type: "success",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Comments & Feedback
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review and engage with discussions left on your published stories.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {commentList.length} Total Feedback
          </span>
        </div>
      </div>

      {/* Comments List */}
      {commentList.length === 0 ? (
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
                  title="Delete comment"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              {/* Comment Content */}
              <p className="text-sm text-foreground/90 leading-relaxed pl-12">
                "{item.content}"
              </p>

              {/* Story Reference */}
              <div className="pl-12 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px]">On story:</span>
                  <span className="font-medium text-foreground">
                    {item.blogTitle}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px]">
                    <ThumbsUp className="size-3" /> {item.likes} likes
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default Comments;