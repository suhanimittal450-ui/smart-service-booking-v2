import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const ROTATING = [
  "pros.",
  "plumbers.",
  "tutors.",
  "stylists.",
  "chefs.",
  "developers.",
];

const matches = [
  { name: "Sparkle Co.", rating: 4.9, price: 89 },
  { name: "Maria Pro Cleaning", rating: 4.8, price: 75 },
  { name: "ShineHub", rating: 4.7, price: 65 },
];

export default function Hero() {
  const [word, setWord] = useState("");
  const [idx, setIdx] = useState(0);
  const [del, setDel] = useState(false);
  const tiltRef = useRef(null);
  const navigate = useNavigate();

  // Typing animation — exact same speed/pause timing as original (90ms type, 50ms delete, 1400ms hold)
  useEffect(() => {
    const target = ROTATING[idx];
    const speed = del ? 50 : 90;

    const timer = setTimeout(() => {
      if (!del && word === target) {
        setTimeout(() => setDel(true), 1400);
        return;
      }
      if (del && word === "") {
        setDel(false);
        setIdx((prev) => (prev + 1) % ROTATING.length);
        return;
      }
      setWord(
        del
          ? target.slice(0, word.length - 1)
          : target.slice(0, word.length + 1),
      );
    }, speed);

    return () => clearTimeout(timer);
  }, [word, del, idx]);

  // 3D mouse-tilt on the concierge card — same rotateX/Y degree range as original
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    };
    const onLeave = () => {
      el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleBookNow = () => {
    navigate("/login");
  };

  return (
    <section
      id="top"
      className="relative px-6 md:px-10 max-w-7xl mx-auto pt-10 pb-24 grid lg:grid-cols-2 gap-14 items-center"
    >
      <div className="relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-soft bg-surface text-soft mb-6"
        >
          <span className="chip-dot" />
          AI POWERED · V2.0 LAUNCHING
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-display text-5xl md:text-6xl font-extrabold leading-[1.05] mb-6"
        >
          Book trusted{" "}
          <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
            {word}
          </span>
          <span className="typed-cursor text-accent-cyan">|</span>
          <br /> in seconds, not days.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-soft text-lg max-w-md mb-8"
        >
          Nexora is the smart service booking platform where AI matches you with
          verified pros, handles scheduling, payments, and live tracking — all
          in one beautifully simple flow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          <Link to="/signup" className="btn-brand">
            Get started free <i className="bi bi-arrow-right ms-2" />
          </Link>
          <a href="#services" className="btn-ghost">
            <i className="bi bi-compass me-2" /> Explore services
          </a>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[
              "bg-lime-400",
              "bg-emerald-400",
              "bg-cyan-400",
              "bg-violet-500",
            ].map((c, i) => (
              <span
                key={i}
                className={`w-8 h-8 rounded-full border-2 border-bg ${c}`}
              />
            ))}
          </div>
          <div className="text-sm">
            <p className="font-semibold">★★★★★ 4.9/5</p>
            <p className="text-soft">from 12,400+ reviews</p>
          </div>
        </div>
      </div>

      <motion.div
        ref={tiltRef}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{
          transformStyle: "preserve-3d",
          transition: "transform .25s ease",
        }}
        className="relative z-10 float-card rounded-3xl border border-soft bg-surface backdrop-blur-xl p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center">
              ✦
            </span>
            <div>
              <p className="font-semibold text-sm">AI Concierge</p>
              <p className="text-xs text-soft">Matching in real time</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-surface border border-soft">
            <span className="chip-dot" /> live
          </span>
        </div>

        <div className="rounded-2xl bg-surface p-4 mb-4 text-sm">
          <p className="text-soft mb-1">You</p>
          <p>I need a deep clean for a 2BR apartment Saturday morning.</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-indigo/10 border border-soft p-4 mb-4">
          <p className="text-sm font-medium mb-3">✦ 3 perfect matches</p>
          <div className="space-y-3">
            {matches.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                    💧
                  </span>
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-soft">★ {m.rating}</p>
                  </div>
                </div>
                <span className="font-semibold">${m.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Book in one tap — smooth regular transition, no bounce */}
        <motion.button
          onClick={handleBookNow}
          className="btn-brand w-full justify-center"
          whileHover={{ scale: 1.03, opacity: 0.93 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
        >
          Book in one tap <i className="bi bi-lightning-charge-fill ms-2" />
        </motion.button>
      </motion.div>
    </section>
  );
}
