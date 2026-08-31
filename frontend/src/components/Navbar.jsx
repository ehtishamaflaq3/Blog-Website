import React from "react";
import logo from "../assets/logo.png";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
const Navbar = () => {
  const user = false;
  return (
    <div className="bg-amber-50 border-b-3 border-t-3 border-gray-400 h-17 w-full flex items-center justify-between px-4 md:px-8">
      {/* LOGO */}
      <div className="flex items-center">
        <img
          className="size-12 md:size-14 cursor-pointer"
          src={logo}
          alt="Logo"
        />
        <Link to='/'>
        <h1  className="pl-2 md:pl-4 text-xl md:text-2xl lg:text-3xl font-bold">
          Logo
        </h1>
        </Link>
        {/* SEARCH */}
        <div className="hidden lg:flex items-center ml-5">
          <input
            type="text"
            placeholder="Search..."
            className="border-2 pl-2 h-10 rounded-l-xl text-lg w-60"
          />
          <IoSearch className="size-11 border-2 bg-black text-white rounded-r-xl " />
        </div>
      </div>
      {/* DESKTOP CONTENT */}
      <div className="hidden lg:flex items-center gap-8">
        {/* LINKS */}
        <ul className="flex items-center gap-6">
          <Link to="/">
            <li className="text-lg xl:text-xl font-bold">Home</li>
          </Link>
          <Link to="/blogs">
            <li className="text-lg xl:text-xl font-bold">Blogs</li>
          </Link>
          <Link to="/about">
            <li className="text-lg xl:text-xl font-bold">About</li>
          </Link>
        </ul>
        {/* MOON */}
        <button className="bg-black h-10 w-12 rounded-2xl text-white flex items-center justify-center">
          <FaMoon className="size-6" />
        </button>
        {/* AUTH */}
        {!user && (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <button className="h-10 px-4 rounded-2xl text-lg font-bold bg-black text-white">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="h-10 px-4 rounded-2xl text-lg font-bold bg-black text-white">
                Signup
              </button>
            </Link>
          </div>
        )}
      </div>
      {/* MOBILE MENU BUTTON */}
      <button className="lg:hidden bg-black text-white px-3 py-2 rounded-lg">
        ☰
      </button>
    </div>
  );
};
export default Navbar;
