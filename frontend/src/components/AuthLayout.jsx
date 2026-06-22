import { Link } from "react-router-dom";
import { motion } from "framer-motion";
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative min-h-screen text-main font-body flex items-center justify-center px-4 py-10">
      <Link to="/" className="fixed top-6 left-6 flex items-center gap-2 z-10">
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

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="lift bg-surface border-soft border backdrop-blur-xl rounded-3xl p-8 md:p-10 w-full max-w-md"
      >
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
          {title}
        </h1>
        {subtitle && <p className="text-soft text-sm mb-6">{subtitle}</p>}
        {children}
        {footer && (
          <div className="mt-6 text-center text-sm text-soft">{footer}</div>
        )}
      </motion.div>
    </div>
  );
}
