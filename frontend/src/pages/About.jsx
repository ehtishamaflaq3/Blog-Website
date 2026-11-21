import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Cloud,
  Code2,
  Database,
  Heart,
  MessageCircle,
  PanelsTopLeft,
  PenTool,
  Server,
  Users,
  Workflow,
} from "lucide-react";

const stack = [
  { name: "React 19", role: "Frontend", icon: Code2 },
  { name: "Tailwind CSS v4", role: "Styling", icon: PanelsTopLeft },
  { name: "Redux Toolkit", role: "State management", icon: Workflow },
  { name: "Node.js & Express", role: "Backend", icon: Server },
  { name: "MongoDB & Mongoose", role: "Database", icon: Database },
  { name: "Cloudinary", role: "Media storage", icon: Cloud },
];

const stats = [
  { key: "posts", label: "Published posts", icon: BookOpen },
  { key: "writers", label: "Contributing writers", icon: Users },
  { key: "likes", label: "Community likes", icon: Heart },
  { key: "comments", label: "Conversations", icon: MessageCircle },
];

const About = () => {
  const navigate = useNavigate();
  const [totals, setTotals] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    let isMounted = true;
    axios
      .get("/blog/all-blogs", { timeout: 15000 })
      .then(({ data }) => {
        if (!Array.isArray(data.blogs)) {
          throw new Error("The server returned an invalid posts response.");
        }
        const blogs = data.blogs;
        const writers = new Set(
          blogs
            .map((blog) => blog.author?._id)
            .filter((authorId) => typeof authorId === "string"),
        );
        const nextTotals = {
          posts: blogs.length,
          writers: writers.size,
          likes: blogs.reduce(
            (total, blog) => total + (Array.isArray(blog.likes) ? blog.likes.length : 0),
            0,
          ),
          comments: blogs.reduce(
            (total, blog) =>
              total + (Array.isArray(blog.comments) ? blog.comments.length : 0),
            0,
          ),
        };
        if (isMounted) {
          setTotals(nextTotals);
          setLoadError("");
        }
      })
      .catch((error) => {
        if (isMounted) {
          setLoadError(
            error.response?.data?.message ||
              error.message ||
              "Could not load community totals.",
          );
        }
      });
    return () => {
      isMounted = false;
    };
  }, [retryCount]);
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background text-foreground transition-colors">
      <main className="flex-1">
        {/* about texture */}
        <section className="border-b border-border/60 bg-muted/20 px-3 py-3 text-center sm:px-5 md:py-3">
          <div className="mx-auto max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                About DevPulse
            </span>
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Good ideas deserve to be shared.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              DevPulse is a community space for developers and curious minds to
              share practical knowledge, explore new ideas, and learn from one
              another.
            </p>
            <Button
              onClick={() => navigate("/blogs")}
              size="lg"
              className="mx-auto gap-2"
            >
              Read the stories
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>
        {/* statistics */}
        <section className="mx-auto flex items-center justify-center max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-2 lg:px-8">
          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  The community so far
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Live totals from published community posts.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map(({ key, label, icon: Icon }) => (
                <Card
                  key={key}
                  className="flex aspect-square flex-col items-center justify-center gap-3 border-border/70 bg-card p-5 text-center shadow-sm transition-transform hover:-translate-y-1 sm:gap-5 sm:p-9"
                >
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {totals ? totals[key].toLocaleString() : "—"}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                    {label}
                  </span>
                </Card>
              ))}
            </div>
            {loadError && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
                <p className="text-destructive">{loadError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRetryCount((count) => count + 1)}
                >
                  Try again
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/20 px-4 py-5 text-center sm:px-6 md:py-3">
          <div className="mx-auto max-w-5xl">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              The toolkit
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Powered by modern technologies
            </h2>
            <p className="mx-auto mb-8 mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A dependable stack, chosen to make publishing and discovering
              ideas feel fast and straightforward.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {stack.map(({ name, role, icon: Icon }) => (
                <div
                  key={name}
                  className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border border-border/70 bg-card p-4 shadow-sm"
                >
                  <Icon className="size-5 text-primary" />
                  <span className="text-sm font-bold">{name}</span>
                  <span className="text-xs text-muted-foreground">
                    {role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      {/* footer */}
      <Footer />
    </div>
  );
};
export default About;