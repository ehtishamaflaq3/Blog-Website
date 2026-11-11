import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../pages/redux/authSlice";
import { toggleTheme } from "../pages/redux/themeSlice";
import logo from "../assets/logo.png";
import userlogo from "../assets/user.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "../components/ui/toast";
import {
  ChartBarBig,
  LogOutIcon,
  Menu,
  MessageSquareText,
  Moon,
  Search,
  SquarePen,
  Sun,
  UserIcon,
  X,
} from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const { theme } = useSelector((store) => store.theme);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/user/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/");
        dispatch(setUser(null));
        toast.add({
          title: "Logged Out",
          description: "You have been logged out successfully.",
          type: "success",
        });
      }
    } catch (error) {
      toast.add({
        title: "Logout Failed",
        description: error.response?.data?.message || "Something went wrong.",
        type: "error",
      });
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Blogs", path: "/blogs" },
    { label: "About", path: "/about" },
  ];

  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase()
    : "U";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex  items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src={logo}
                alt="DevPulse Logo"
                className="size-11 object-contain dark:invert transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-extrabold text-xl tracking-tight bg-linear-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                DevPulse
              </span>
            </Link>
            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center relative ml-6"
            >
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics..."
                className="w-56 lg:w-72 h-9 pl-9 pr-3 rounded-full border border-border/80 bg-muted/40 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:w-80 transition-all duration-200"
              />
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => dispatch(toggleTheme())}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="rounded-full cursor-pointer text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="size-5 text-amber-400" />
              ) : (
                <Moon className="size-5" />
              )}
            </Button>
            {/* Write Button for authenticated users */}
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard/create-blog")}
                className="hidden sm:inline-flex items-center gap-2 text-xm font-medium"
              >
                <SquarePen className="size-4 text-primary" />
                <span className="text-sm font-bold">Write</span>
              </Button>
            )}
            {/* Auth section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center rounded-full outline-none focus:outline-none cursor-pointer p-0 border-0 bg-transparent">
                  <Avatar className="size-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer">
                    <AvatarImage
                      src={user.photoUrl || userlogo}
                      alt={user.firstName || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg">
                  <div className="px-2 py-2">
                    <p className="text-sm font-bold text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/profile")}
                      className="cursor-pointer gap-2"
                    >
                      <UserIcon className="size-4 text-muted-foreground" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/your-blog")}
                      className="cursor-pointer gap-2"
                    >
                      <ChartBarBig className="size-4 text-muted-foreground" />
                      <span>Your Blogs</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/comments")}
                      className="cursor-pointer gap-2"
                    >
                      <MessageSquareText className="size-4 text-muted-foreground" />
                      <span>Comments</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/create-blog")}
                      className="cursor-pointer gap-2"
                    >
                      <SquarePen className="size-4 text-primary" />
                      <span>Create Blog</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logoutHandler}
                    variant="destructive"
                    className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10"
                  >
                    <LogOutIcon className="size-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="text-xs sm:text-sm font-medium cursor-pointer"
                >
                  Log In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/signup")}
                  className="text-xs sm:text-sm font-medium cursor-pointer shadow-xs"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-foreground"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pt-3 pb-6 space-y-4 shadow-xl">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-muted/40 text-sm"
            />
          </form>

          {/* Mobile Links */}
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {user && (
              <Link
                to="/dashboard/create-blog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-muted flex items-center gap-2"
              >
                <SquarePen className="size-4" />
                Write New Story
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
