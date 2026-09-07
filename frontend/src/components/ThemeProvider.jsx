import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-950 dark:text-gray-100">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;