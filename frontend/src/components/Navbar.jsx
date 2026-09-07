import logo from "../assets/logo.png";
import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const { theme } = useSelector((store) => store.theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="bg-amber-50 text-slate-900 border-b-3 border-t-3 border-gray-400 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 h-17 w-full flex items-center justify-between px-4 md:px-8 transition-colors">
      {/* LOGO */}
      <div className="flex items-center">
        <img
          className="size-12 md:size-15 cursor-pointer dark:invert"
          src={logo}
          onClick={() => navigate("/")}
          alt="Logo"
        />
        <Link to="/">
          <h1 className="pl-2 md:pl-4 text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Logo
          </h1>
        </Link>
        {/* SEARCH */}
        <div className="hidden lg:flex items-center ml-6">
          <input
            type="text"
            placeholder="Search..."
            className="border-2 border-slate-300 bg-white pl-2 h-10 rounded-l-xl text-lg text-slate-900 placeholder:text-slate-500 w-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
          <IoSearch className="size-11 border-2 bg-black text-white rounded-r-xl " />
        </div>
      </div>
      {/* DESKTOP CONTENT */}
      <div className="hidden lg:flex items-center gap-8">
        {/* LINKS */}
        <ul className="flex items-center gap-6">
          <Link to="/">
            <li className="text-lg xl:text-xl font-bold text-slate-900 dark:text-slate-100">Home</li>
          </Link>
          <Link to="/blogs">
            <li className="text-lg xl:text-xl font-bold text-slate-900 dark:text-slate-100">Blogs</li>
          </Link>
          <Link to="/about">
            <li className="text-lg xl:text-xl font-bold text-slate-900 dark:text-slate-100">About</li>
          </Link>
        </ul>
        {/* MOON */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="bg-slate-900 h-10 w-12 rounded-2xl text-white flex items-center justify-center dark:bg-amber-300 cursor-pointer dark:text-slate-900"
        >
          {theme === "dark" ? (
            <FaSun className="size-6" />
          ) : (
            <FaMoon className="size-6" />
          )}
        </button>
        {/* AUTH */}
        {user ? (
          <div className="flex items-center gap-3">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg cursor-pointer">
                {user.username?.charAt(0).toUpperCase()}{" "}
              </div>
            )}
            <Link to="/">
              <button className="h-10 px-4 rounded-2xl text-lg font-bold bg-black cursor-pointer text-white">
                Logout
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <button className="h-10 px-4 rounded-2xl text-lg font-bold bg-black cursor-pointer text-white">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="h-10 px-4 rounded-2xl text-lg font-bold bg-black cursor-pointer text-white">
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
