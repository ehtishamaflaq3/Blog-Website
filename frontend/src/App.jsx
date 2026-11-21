import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import YourBlog from "./pages/YourBlog";
import Comments from "./pages/Comments";
import CreateBlog from "./pages/CreateBlog";
import UpdateBlog from "./pages/UpdateBlog";
import BlogsView from "./pages/BlogsView";
import ScrollToTop from "./components/ScrollToTop";

const router = createBrowserRouter([
  {
    element: <ScrollToTop />,
    children: [
      {
        path: "/",
        element: (
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <Home />
          </div>
        ),
      },
      {
        path: "/blogs",
        element: (
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <Blogs />
          </div>
        ),
      },
      {
        path: "/blogs/:blogId",
        element: (
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <BlogsView />
          </div>
        ),
      },
      {
        path: "/about",
        element: (
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <About />
          </div>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <Dashboard />
          </div>
        ),
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "your-blog",
            element: <YourBlog />,
          },
          {
            path: "comments",
            element: <Comments />,
          },
          {
            path: "create-blog",
            element: <CreateBlog />,
          },
          {
            path: "create-blog/:blogId",
            element: <UpdateBlog />,
          },
        ],
      },
      {
        path: "/login",
        element: (
          <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
            <div className="shrink-0">
              <Navbar />
            </div>
            <div className="min-h-0 flex-1">
              <Login />
            </div>
          </div>
        ),
      },
      {
        path: "/signup",
        element: (
          <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
            <div className="shrink-0">
              <Navbar />
            </div>
            <div className="min-h-0 flex-1">
              <Signup />
            </div>
          </div>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
