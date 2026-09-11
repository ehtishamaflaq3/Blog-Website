import { ChartColumnBig, SquareUser } from "lucide-react";
import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { LiaCommentSolid } from "react-icons/lia";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-full border-4 dark:border-gray-600 border-r-gray-400 border-l-gray-400 border-b-gray-400 bg-white dark:invert w-[20%]">
      <div className="text-center border-black pt-10 gap-6 flex flex-col h-full px-3">
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent dark:text-gray-800"} text-3xl flex items-center rounded-2xl w-full p-5 gap-3 font-bold cursor-pointer`
          }
        >
          <SquareUser />
          <span>Profile</span>
        </NavLink>
        <NavLink
          to="/dashboard/your-blog"
          className={({ isActive }) =>
            `${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "dark:text-gray-800 bg-transparent"} text-3xl flex items-center rounded-2xl w-full p-5 gap-3 font-bold cursor-pointer`
          }
        >
          <ChartColumnBig />
          <span>Your Blogs</span>
        </NavLink>
        <NavLink
          to="/dashboard/comments"
          className={({ isActive }) =>
            `${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent dark:text-gray-800"} text-3xl flex items-center rounded-2xl w-full p-5 gap-3 font-bold cursor-pointer`
          }
        >
          <LiaCommentSolid />
          <span>Comments</span>
        </NavLink>
        <NavLink
          to="/dashboard/create-blog"
          className={({ isActive }) =>
            `${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "dark:text-gray-800 bg-transparent"} text-3xl flex items-center rounded-2xl w-full p-5 gap-3 font-bold cursor-pointer`
          }
        >
          <FaRegEdit />
          <span>Create Blog</span>
        </NavLink>
      </div>
    </div>
  );
};
export default Sidebar;
