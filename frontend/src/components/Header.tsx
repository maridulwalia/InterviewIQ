import { Brain, LogOut, User, LayoutDashboard, FileText, MessageSquare, ChevronDown } from "lucide-react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Upload Resume", path: "/upload", icon: FileText },
  { label: "Interview", path: "/interview", icon: MessageSquare },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = localStorage.getItem("token");
  const isAuthPage = ["/", "/login", "/signup"].includes(location.pathname);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 glass-card border-b border-border/50 px-6 py-3"
    >
      <div className="container mx-auto flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <button
          onClick={() => navigate(isAuth ? "/dashboard" : "/login")}
          className="flex items-center gap-2 group shrink-0"
        >
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Interview<span className="gradient-text">IQ</span>
          </span>
        </button>

        {/* ── Nav Links (authenticated, non-auth pages only) ── */}
        {isAuth && !isAuthPage && (
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(({ label, path, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <NavLink
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </NavLink>
              );
            })}
          </nav>
        )}

        {/* ── Right: Profile dropdown ── */}
        {isAuth && !isAuthPage && (
          <div className="relative shrink-0" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 text-sm font-medium transition-all"
            >
              {/* Avatar circle */}
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden sm:block max-w-[120px] truncate">{user?.name || "My Account"}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl glass-card border border-border/60 shadow-xl overflow-hidden"
                >
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-border/50 bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{user?.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                      </div>
                    </div>
                  </div>

                  {/* Nav quick-links */}
                  <div className="py-1">
                    {navItems.map(({ label, path, icon: Icon }) => (
                      <button
                        key={path}
                        onClick={() => { navigate(path); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors text-left"
                      >
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-border/50 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.header>
  );
}
