import { Brain, LogOut, LayoutDashboard, MessageSquare, BarChart3, FileText } from "lucide-react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/resume", label: "Resume", icon: FileText },
  { to: "/interview", label: "Interview", icon: MessageSquare },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuth = token && token !== "undefined" && token !== "null";
  const isAuthPage = ["/login", "/signup", "/"].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 glass-card border-b border-border/50 px-4 sm:px-6 py-3"
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <button onClick={() => navigate(isAuth ? "/dashboard" : "/")} className="flex items-center gap-2 group shrink-0">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Interview<span className="gradient-text">IQ</span>
          </span>
        </button>

        {isAuth && !isAuthPage && (
          <nav className="hidden md:flex items-center gap-1 relative">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>
        )}

        {isAuth && !isAuthPage && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        )}
      </div>

      {isAuth && !isAuthPage && (
        <nav className="md:hidden flex items-center gap-1 mt-2 overflow-x-auto">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      )}
    </motion.header>
  );
}