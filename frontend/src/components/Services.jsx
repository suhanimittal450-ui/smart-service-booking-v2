import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const services = [
  {
    tag: "Home",
    title: "Home Cleaning",
    price: 49,
    rating: 4.9,
    icon: "bi-house-heart-fill",
    tint: "34,211,238",
  },
  {
    tag: "Repairs",
    title: "Plumbing Repair",
    price: 79,
    rating: 4.8,
    icon: "bi-wrench-adjustable-circle-fill",
    tint: "79,70,229",
  },
  {
    tag: "Beauty",
    title: "Hair & Beauty",
    price: 39,
    rating: 5.0,
    icon: "bi-scissors",
    tint: "255,77,109",
  },
  {
    tag: "Tech",
    title: "Device Setup",
    price: 59,
    rating: 4.8,
    icon: "bi-laptop",
    tint: "124,58,237",
  },
  {
    tag: "Outdoor",
    title: "Lawn & Garden",
    price: 45,
    rating: 4.7,
    icon: "bi-flower1",
    tint: "0,208,132",
  },
  {
    tag: "Learning",
    title: "Private Tutoring",
    price: 35,
    rating: 4.9,
    icon: "bi-mortarboard-fill",
    tint: "255,159,28",
  },
];

export default function Services() {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/login");
  };

  return (
    <section
      id="services"
      className="relative px-6 md:px-10 max-w-7xl mx-auto py-20"
    >
      <div className="text-center max-w-2xl mx-auto mb-12">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent-cyan text-sm font-semibold mb-3 inline-block"
        >
          CURATED, VETTED, AND AI-RANKED
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl md:text-4xl font-bold"
        >
          Browse the categories Nexora users book most
        </motion.h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s, index) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: index * 0.06, duration: 0.6 }}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={handleBookNow}
            className="lift rounded-2xl border border-soft bg-surface overflow-hidden cursor-pointer"
            style={{ transition: "box-shadow 0.3s ease" }}
          >
            <div
              className="h-40 flex items-center justify-center text-3xl"
              style={{
                background: `radial-gradient(circle at 30% 20%, rgba(${s.tint},0.45), rgba(${s.tint},0.05) 70%)`,
              }}
            >
              <span className="w-16 h-16 rounded-full bg-surface flex items-center justify-center">
                <i
                  className={`bi ${s.icon}`}
                  style={{
                    filter: `drop-shadow(0 6px 24px rgba(${s.tint},0.6))`,
                  }}
                />
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-surface text-soft">
                  {s.tag}
                </span>
                <span className="flex items-center gap-1">
                  <i className="bi bi-star-fill text-accent-cyan" /> {s.rating}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-soft text-sm mb-4">
                Fast, reliable, and backed by Nexora's satisfaction guarantee.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-soft">
                <div>
                  <p className="text-xs text-soft">Starting at</p>
                  <p className="text-accent-cyan font-semibold">${s.price}</p>
                </div>
                <motion.button
                  type="button"
                  aria-label={`Book ${s.title}`}
                  className="btn-icon"
                  whileHover={{ x: 4 }}
                  transition={{ type: "tween", duration: 0.2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookNow();
                  }}
                >
                  <i className="bi bi-arrow-right" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Book service prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center mt-10"
      >
        <p className="text-soft text-sm mb-3">
          Ready to book? Sign in to get started instantly.
        </p>
        <motion.button
          onClick={handleBookNow}
          className="btn-brand"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "tween", duration: 0.18 }}
        >
          Book a service <i className="bi bi-arrow-right ms-2" />
        </motion.button>
      </motion.div>
    </section>
  );
}
