import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const links = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

const dashboardPath = {
  customer: "/dashboard/customer",
  provider: "/dashboard/provider",
  admin: "/dashboard/admin",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = () => setOpen(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div
        className={`bg-surface border-soft max-w-6xl mx-auto flex items-center justify-between gap-4 rounded-full border backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "shadow-[0_8px_40px_-12px_rgba(102,16,242,0.45)] py-2.5 px-5"
            : "py-3.5 px-6"
        }`}
      >
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          {/* Logo icon — rotates 360° on hover */}
          <motion.span
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "var(--grad-brand)" }}
            animate={{ rotate: logoHovered ? 360 : 0 }}
            transition={{
              duration: logoHovered ? 0.6 : 0.4,
              ease: "easeInOut",
              type: "tween",
            }}
          >
            N
          </motion.span>
          <span className="font-display font-bold text-base text-main">
            Nexora<span style={{ color: "var(--accent)" }}>.</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="nav-link-x whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="btn-icon !w-10 !h-10 text-base"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {user ? (
            <>
              <Link
                to={dashboardPath[user.role]}
                className="btn-ghost !py-2 !px-4 text-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn-brand !py-2 !px-4 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost !py-2 !px-4 text-sm">
                Sign in
              </Link>
              <Link to="/signup" className="btn-brand !py-2 !px-4 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="bg-surface border-soft lg:hidden md:hidden text-xl text-main w-10 h-10 grid place-items-center rounded-full border"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <i className={`bi ${open ? "bi-x-lg" : "bi-list"}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="bg-surface border-soft max-w-6xl mx-auto mt-3 rounded-3xl border backdrop-blur-xl p-6 flex flex-col gap-4 lg:hidden"
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={handleNavClick}
                className="nav-link-x text-base"
              >
                {l.label}
              </a>
            ))}
            <div className="border-soft flex items-center gap-3 pt-3 border-t">
              <button
                onClick={toggle}
                aria-label="Toggle theme"
                className="btn-icon !w-10 !h-10"
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
              {user ? (
                <Link
                  to={dashboardPath[user.role]}
                  onClick={handleNavClick}
                  className="btn-ghost flex-1 justify-center text-sm"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="btn-ghost flex-1 justify-center text-sm"
                >
                  Sign in
                </Link>
              )}
            </div>
            {user ? (
              <button
                onClick={handleLogout}
                className="btn-brand justify-center text-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/signup"
                onClick={handleNavClick}
                className="btn-brand justify-center text-sm"
              >
                Get started
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
