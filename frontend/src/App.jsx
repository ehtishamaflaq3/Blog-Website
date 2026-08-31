import React from "react";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/blogs",
    element: (
      <>
        <Navbar />
        <Blogs />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <Navbar />
        <About />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <div className="min-h-screen lg:h-screen lg:overflow-hidden">
        <Navbar />
        <div className="lg:h-[calc(100vh-4.25rem)] lg:overflow-hidden">
          <Login />
        </div>
      </div>
    ),
  },
  {
    path: "/signup",
    element: (
      <div className="min-h-screen lg:h-screen lg:overflow-hidden">
        <Navbar />
        <div className="lg:h-[calc(100vh-4.25rem)] lg:overflow-hidden">
          <Signup />
        </div>
      </div>
    ),
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
