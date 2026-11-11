import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ChartBarBig,
  MessageSquare,
  SquarePen,
  User,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  {
    to: "/dashboard/profile",
    label: "Profile",
    icon: User,
    description: "Manage your account & bio",
  },
  {
    to: "/dashboard/your-blog",
    label: "Your Blogs",
    icon: ChartBarBig,
    description: "View & manage your articles",
  },
  {
    to: "/dashboard/comments",
    label: "Comments",
    icon: MessageSquare,
    description: "Recent article responses",
  },
  {
    to: "/dashboard/create-blog",
    label: "Create Blog",
    icon: SquarePen,
    description: "Draft a new story",
    highlight: true,
  },
];

const Sidebar = () => {
  const { user } = useSelector((store) => store.auth);

  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase()
    : "U";

  return (
    <aside className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-border/70 bg-card/40 backdrop-blur-sm flex flex-col justify-between shrink-0 p-3 sm:p-4">
      {/* Top Header / Menu */}
      <div className="space-y-6">
        {/* Navigation list */}
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-1.5 scrollbar-none py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 md:shrink md:w-full group ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-white/20 border-2 border-black"
                          : item.highlight
                            ? "bg-primary/10 text-primary "
                            : "bg-muted border-2 border-gray-400 text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>

                    <div className="flex-1 hidden md:block text-left">
                      <p className="truncate leading-none">{item.label}</p>
                      <p
                        className={`text-[10px] pt-1 truncate ${
                          isActive
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>

                    <span className="md:hidden font-medium">{item.label}</span>

                    <ChevronRight
                      className={`size-3.5 hidden md:block transition-transform group-hover:translate-x-0.5 ${
                        isActive
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground/60"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Mini Card */}
      {user && (
        <div className="hidden md:flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-muted/30 mt-6">
          <Avatar className="size-9 ring-1 ring-border">
            <AvatarImage src={user.photoUrl} alt={user.firstName} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {user.occupation || user.email}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
