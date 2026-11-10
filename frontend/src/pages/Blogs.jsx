import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { setBlog } from "./redux/blogSlice";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Filter,
  Search,
  Sparkles,
  X,
  BookOpen,
} from "lucide-react";

const categories = [
  "All",
  "Web Development",
  "Digital Marketing",
  "Blogging",
  "Photography",
  "Cooking",
];

const Blogs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { blog: blogsList, loading: reduxLoading } = useSelector(
    (store) => store.blog
  );

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [sortBy, setSortBy] = useState("latest");
  const [fetching, setFetching] = useState(!blogsList?.length);

  // Sync search input if URL changes
  useEffect(() => {
    const q = searchParams.get("search");
    const c = searchParams.get("category");
    if (q !== null) setSearchTerm(q);
    if (c !== null) setSelectedCategory(c);
  }, [searchParams]);

  // Load blogs if redux store doesn't have them yet
  useEffect(() => {
    let isMounted = true;
    if (!blogsList || blogsList.length === 0) {
      setFetching(true);
      axios
        .get("http://localhost:3000/api/v1/blog/your-blog", {
          withCredentials: true,
          timeout: 15000,
        })
        .then((res) => {
          if (isMounted) {
            const list = res.data.blogs ?? res.data.blog ?? [];
            if (Array.isArray(list)) {
              dispatch(setBlog(list));
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setFetching(false);
        });
    } else {
      setFetching(false);
    }
    return () => {
      isMounted = false;
    };
  }, [blogsList, dispatch]);

  // Filter & Sort blogs
  const filteredBlogs = useMemo(() => {
    const list = Array.isArray(blogsList) ? blogsList : [];
    return list
      .filter((item) => {
        const matchesCategory =
          selectedCategory === "All" ||
          (item.category &&
            item.category.toLowerCase() === selectedCategory.toLowerCase());

        const matchesSearch =
          !searchTerm.trim() ||
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.subTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "latest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      });
  }, [blogsList, selectedCategory, searchTerm, sortBy]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSearchParams({});
  };

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
      {/* Page Header */}
      <div className="border-b border-border/70 bg-muted/20 py-8 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Stories & Insights for Builders
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Discover in-depth engineering breakdowns, modern web design
            tutorials, and community wisdom.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, keyword, or topic..."
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-card text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-6">
        {/* Category Pills & Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-card border border-border rounded-lg px-2.5 py-1 text-xs text-foreground focus:outline-none cursor-pointer"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredBlogs.length}</strong> {filteredBlogs.length === 1 ? "article" : "articles"}
          </span>
          {(searchTerm || selectedCategory !== "All") && (
            <button
              onClick={handleClearFilters}
              className="text-primary hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Loading Skeleton */}
        {fetching && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border p-4 space-y-4"
              >
                <div className="aspect-video bg-muted rounded-xl" />
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!fetching && filteredBlogs.length === 0 && (
          <Card className="p-12 text-center border-dashed border-2 bg-muted/20 max-w-lg mx-auto">
            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <BookOpen className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              No articles found
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              {searchTerm
                ? `No articles matched your search for "${searchTerm}".`
                : "No articles found in this category."}
            </p>
            <Button size="sm" onClick={handleClearFilters}>
              Reset Filters
            </Button>
          </Card>
        )}

        {/* Blog Grid */}
        {!fetching && filteredBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => {
              const authorObj = blog.author;
              const authorName =
                typeof authorObj === "object" && authorObj
                  ? `${authorObj.firstName || ""} ${authorObj.lastName || ""}`.trim()
                  : "Writer";
              const authorPhoto =
                typeof authorObj === "object" ? authorObj?.photoUrl : "";

              return (
                <div
                  key={blog._id}
                  onClick={() => navigate(`/blogs/${blog._id}`)}
                  className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-xs hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    {blog.thumbnail ? (
                      <div className="overflow-hidden rounded-xl aspect-video bg-muted/40">
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="rounded-xl aspect-video bg-muted/30 flex items-center justify-center text-xs text-muted-foreground">
                        No image preview
                      </div>
                    )}

                    {/* Category tag */}
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                      {blog.category || "General"}
                    </span>

                    {/* Title */}
                    <h2 className="font-bold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {blog.title}
                    </h2>

                    {/* Subtitle */}
                    {blog.subTitle && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {blog.subTitle}
                      </p>
                    )}
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground mt-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarImage src={authorPhoto} alt={authorName} />
                        <AvatarFallback className="text-[10px]">
                          {authorName[0] || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground truncate max-w-[120px]">
                        {authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Blogs;
