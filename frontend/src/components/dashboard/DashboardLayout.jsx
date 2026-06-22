import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const NAV = {
  customer: [
    {
      to: "/dashboard/customer",
      label: "Overview",
      icon: "bi-grid-fill",
      end: true,
    },
    {
      to: "/dashboard/customer/services",
      label: "Browse Services",
      icon: "bi-compass-fill",
    },
    {
      to: "/dashboard/customer/bookings",
      label: "My Bookings",
      icon: "bi-calendar-check-fill",
    },
    {
      to: "/dashboard/customer/profile",
      label: "Profile",
      icon: "bi-person-fill",
    },
  ],
  provider: [
    {
      to: "/dashboard/provider",
      label: "Overview",
      icon: "bi-grid-fill",
      end: true,
    },
    {
      to: "/dashboard/provider/services",
      label: "My Services",
      icon: "bi-tools",
    },
    {
      to: "/dashboard/provider/bookings",
      label: "Bookings",
      icon: "bi-calendar-check-fill",
    },
    {
      to: "/dashboard/provider/profile",
      label: "Profile",
      icon: "bi-person-fill",
    },
  ],
  admin: [
    {
      to: "/dashboard/admin",
      label: "Overview",
      icon: "bi-grid-fill",
      end: true,
    },
    { to: "/dashboard/admin/users", label: "Users", icon: "bi-people-fill" },
    {
      to: "/dashboard/admin/bookings",
      label: "All Bookings",
      icon: "bi-calendar-check-fill",
    },
    {
      to: "/dashboard/admin/categories",
      label: "Categories",
      icon: "bi-tags-fill",
    },
    {
      to: "/dashboard/admin/profile",
      label: "Profile",
      icon: "bi-person-fill",
    },
  ],
};

const roleLabel = {
  customer: "Customer",
  provider: "Service Provider",
  admin: "Administrator",
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = NAV[user.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="relative min-h-screen text-main font-body">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 fixed top-4 bottom-4 left-4 bg-surface border-soft border rounded-3xl backdrop-blur-xl p-5">
        <Link to="/" className="flex items-center gap-2 mb-8 px-2">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "var(--grad-brand)" }}
          >
            N
          </span>
          <span className="font-display font-bold text-base text-main">
            Nexora<span style={{ color: "var(--accent)" }}>.</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1.5">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "nav-link-x"
                }`
              }
              style={({ isActive }) =>
                isActive ? { background: "var(--grad-brand)" } : {}
              }
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-soft border-t pt-4 mt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <span className="w-9 h-9 rounded-full bg-surface-strong flex items-center justify-center font-semibold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-faint">{roleLabel[user.role]}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="btn-icon !w-9 !h-9 text-sm flex-1"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <button
              onClick={handleLogout}
              className="btn-ghost flex-1 justify-center !py-2 text-sm"
            >
              <i className="bi bi-box-arrow-right me-1.5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Topbar — mobile */}
      <header className="lg:hidden fixed top-4 left-4 right-4 z-40 bg-surface border-soft border rounded-2xl backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <span className="font-display font-bold">
          Nexora<span style={{ color: "var(--accent)" }}>.</span>
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-icon !w-9 !h-9 text-sm"
        >
          <i className={`bi ${mobileOpen ? "bi-x-lg" : "bi-list"}`} />
        </button>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed top-20 left-4 right-4 z-30 bg-surface border-soft border rounded-2xl backdrop-blur-xl p-4 space-y-1.5"
          >
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "nav-link-x"
                  }`
                }
                style={({ isActive }) =>
                  isActive ? { background: "var(--grad-brand)" } : {}
                }
              >
                <i className={`bi ${item.icon}`} />
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="btn-ghost w-full justify-center !py-2.5 text-sm mt-2"
            >
              <i className="bi bi-box-arrow-right me-1.5" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:ml-72 lg:mr-4 lg:my-4 pt-24 lg:pt-4 px-4 pb-10">
        <Outlet />
      </main>
    </div>
  );
}
