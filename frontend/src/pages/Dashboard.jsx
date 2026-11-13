import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] w-full bg-background text-foreground transition-colors">
      <Sidebar />
      <main
        className="flex-1 min-w-0 overflow-y-auto"
        data-route-scroll-container
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
