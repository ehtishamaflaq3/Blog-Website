import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Herosection from "../components/Herosection";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Code2,
  Compass,
  Feather,
  Layers,
  Sparkles,
  Zap,
  Calendar,
  Clock,
} from "lucide-react";

const categories = [
  { name: "Web Development", icon: Code2, count: "120+ posts" },
  { name: "Digital Marketing", icon: Zap, count: "80+ posts" },
  { name: "Blogging & Writing", icon: Feather, count: "65+ posts" },
  { name: "Photography & Media", icon: Layers, count: "45+ posts" },
  { name: "Cooking & Lifestyle", icon: Compass, count: "30+ posts" },
];

const Home = () => {
  const navigate = useNavigate();
  const { blog: blogsList } = useSelector((store) => store.blog);

  // Take top 3-6 blogs for preview
  const featuredBlogs = Array.isArray(blogsList) ? blogsList.slice(0, 3) : [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently published";
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime())
      ? "Recently published"
      : d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      {/* Hero Section */}
      <Herosection />
      {/* Popular Categories Bar */}
      <section className="border-y border-border/60 bg-muted/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Popular Categories
              </h2>
              <p className="text-xs text-muted-foreground">
                Browse our curated selection of top knowledge tracks
              </p>
            </div>
            <Link
              to="/blogs"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Explore all</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() =>
                    navigate(`/blogs?category=${encodeURIComponent(cat.name)}`)
                  }
                  className="group flex flex-col p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="size-4" />
                  </div>
                  <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground pt-0.5">
                    {cat.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured / Recent Stories Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                  Featured Stories
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Thoughtful perspectives and trending developer write-ups.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/blogs")}
                className="w-fit gap-1 text-xs"
              >
                <span>Browse All Articles</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 border-2 gap-6">
              {featuredBlogs.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/blogs/${item._id}`)}
                  className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-all duration-300 hover:shadow-xl hover:border-primary/40 cursor-pointer"
                >
                  <div className="space-y-3">
                    {item.thumbnail ? (
                      <div className="overflow-hidden rounded-xl aspect-video bg-muted/30">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="rounded-xl aspect-video bg-muted/40 flex items-center justify-center text-xs text-muted-foreground">
                        No preview image
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-primary px-2 py-1 rounded-md bg-primary/10">
                        {item.category || "General"}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {item.subTitle && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.subTitle}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground mt-4">
                    <span className="flex items-center gap-1">
                      {formatDate(item.createdAt)}
                    </span>
                    <span className="font-medium text-primary group-hover:translate-x-1 transition-transform">
                      Read article →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;