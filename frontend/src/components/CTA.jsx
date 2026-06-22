import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/* ─── Demo slides — each has a title, body text, icon, and narration ─── */
const SLIDES = [
  {
    icon: "🚀",
    title: "Welcome to Nexora",
    body: "Nexora is your all-in-one smart service booking platform. Powered by AI, it connects you with verified professionals for any task — from home cleaning to tutoring.",
    bg: "from-violet-600/30 to-cyan-500/20",
    narration:
      "Welcome to Nexora — your all-in-one smart service booking platform. Powered by AI, it connects you with verified professionals for any task, from home cleaning to tutoring.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Matching",
    body: "Our AI Concierge reads your request in plain language and instantly finds the top 3 matched professionals near you — ranked by rating, availability, and price.",
    bg: "from-cyan-500/30 to-indigo-600/20",
    narration:
      "Our AI Concierge reads your request in plain language and instantly finds the top three matched professionals near you — ranked by rating, availability, and price.",
  },
  {
    icon: "📅",
    title: "Book in One Tap",
    body: "Choose your preferred pro, pick a time slot, and confirm the booking — all in under 60 seconds. No calls, no waiting, no back-and-forth messages.",
    bg: "from-emerald-500/30 to-cyan-400/20",
    narration:
      "Choose your preferred pro, pick a time slot, and confirm the booking — all in under sixty seconds. No calls, no waiting, no back-and-forth messages.",
  },
  {
    icon: "📍",
    title: "Live Tracking & Updates",
    body: "Track your professional in real time on a live map. Get instant notifications when they're on their way, arriving, and when the job is done.",
    bg: "from-pink-500/30 to-violet-500/20",
    narration:
      "Track your professional in real time on a live map. Get instant notifications when they are on their way, arriving, and when the job is done.",
  },
  {
    icon: "💳",
    title: "Secure Payments",
    body: "Pay seamlessly after service completion. Nexora holds payment in escrow until you confirm satisfaction — your money is always protected.",
    bg: "from-amber-500/30 to-orange-400/20",
    narration:
      "Pay seamlessly after service completion. Nexora holds payment in escrow until you confirm satisfaction — your money is always protected.",
  },
  {
    icon: "⭐",
    title: "Rate & Review",
    body: "After every job, leave a rating and review. Your feedback keeps our marketplace trusted, transparent, and improving for everyone.",
    bg: "from-cyan-400/30 to-violet-600/20",
    narration:
      "After every job, leave a rating and review. Your feedback keeps our marketplace trusted, transparent, and improving for everyone.",
  },
  {
    icon: "✅",
    title: "Get Started Free",
    body: "Create your free Nexora account today. No subscription needed — pay only when you book. Join 10,000+ people getting things done smarter.",
    bg: "from-violet-500/30 to-emerald-500/20",
    narration:
      "Create your free Nexora account today. No subscription needed — pay only when you book. Join ten thousand plus people getting things done smarter.",
  },
];

const SLIDE_DURATION = 4200; // ms per slide

export default function CTA() {
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progRef = useRef(null);
  const startRef = useRef(null);
  const speechRef = useRef(null);

  /* ── speak a slide ── */
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95;
    utt.pitch = 1;
    utt.volume = 1;
    // prefer a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") ||
            v.name.includes("Natural") ||
            v.name.includes("Samantha")),
      ) || voices.find((v) => v.lang.startsWith("en"));
    if (preferred) utt.voice = preferred;
    speechRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  /* ── progress bar animation ── */
  const startProgress = () => {
    setProgress(0);
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) progRef.current = requestAnimationFrame(tick);
    };
    progRef.current = requestAnimationFrame(tick);
  };

  /* ── advance slide ── */
  const goToSlide = (idx, autoPlay = true) => {
    cancelAnimationFrame(progRef.current);
    clearTimeout(timerRef.current);
    setSlide(idx);
    if (autoPlay && playing) {
      speak(SLIDES[idx].narration);
      startProgress();
      timerRef.current = setTimeout(() => {
        goToSlide((idx + 1) % SLIDES.length);
      }, SLIDE_DURATION);
    }
  };

  /* ── play / pause ── */
  const togglePlay = () => {
    if (playing) {
      window.speechSynthesis?.cancel();
      clearTimeout(timerRef.current);
      cancelAnimationFrame(progRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  };

  /* start playing when `playing` flips to true */
  useEffect(() => {
    if (!open) return;
    if (playing) {
      speak(SLIDES[slide].narration);
      startProgress();
      timerRef.current = setTimeout(() => {
        goToSlide((slide + 1) % SLIDES.length);
      }, SLIDE_DURATION);
    }
    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(progRef.current);
    };
  }, [playing, open]);

  /* auto-start when modal opens */
  useEffect(() => {
    if (open) {
      setSlide(0);
      setProgress(0);
      setPlaying(true);
    } else {
      window.speechSynthesis?.cancel();
      clearTimeout(timerRef.current);
      cancelAnimationFrame(progRef.current);
      setPlaying(false);
      setProgress(0);
      setSlide(0);
    }
  }, [open]);

  /* load voices early */
  useEffect(() => {
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
  }, []);

  const current = SLIDES[slide];

  return (
    <>
      {/* ─── CTA Section ─── */}
      <section
        id="cta"
        className="relative px-6 md:px-10 max-w-7xl mx-auto py-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[36px] p-12 md:p-16 text-center bg-surface border border-soft"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(600px 300px at 50% 0%, rgba(34,211,238,0.25), transparent 60%), radial-gradient(800px 400px at 50% 100%, rgba(124,58,237,0.3), transparent 60%)",
            }}
          />
          <div className="relative">
            <p className="text-accent-cyan text-sm font-semibold mb-3">
              <i className="bi bi-rocket-takeoff-fill" /> READY WHEN YOU ARE
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Stop searching. Start booking.
            </h2>
            <p className="text-soft max-w-md mx-auto mb-8">
              Join 10,000+ people who use Nexora every week to get things done
              faster, safer, and smarter.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/signup" className="btn-brand">
                Create free account <i className="bi bi-arrow-right ms-2" />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="btn-ghost"
              >
                <i className="bi bi-play-circle-fill me-2" /> Watch demo
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Demo Modal ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-soft bg-surface shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── slide area ── */}
              <div
                className={`relative h-72 md:h-80 flex flex-col items-center justify-center bg-gradient-to-br ${current.bg} px-8 text-center overflow-hidden`}
              >
                {/* slide counter progress bars */}
                <div className="absolute top-4 left-4 right-4 flex gap-1">
                  {SLIDES.map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.15)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--accent-cyan, #22d3ee)" }}
                        animate={{
                          width:
                            i < slide
                              ? "100%"
                              : i === slide
                                ? `${progress}%`
                                : "0%",
                        }}
                        transition={{ duration: 0.05, ease: "linear" }}
                      />
                    </div>
                  ))}
                </div>

                {/* close btn */}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface border border-soft flex items-center justify-center text-sm hover:opacity-80 transition-opacity z-10"
                  aria-label="Close"
                >
                  <i className="bi bi-x-lg" />
                </button>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <span className="text-6xl">{current.icon}</span>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-main">
                      {current.title}
                    </h3>
                    <p className="text-soft text-sm md:text-base max-w-sm leading-relaxed">
                      {current.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── controls ── */}
              <div className="px-6 py-5 flex items-center justify-between gap-4">
                {/* dot nav */}
                <div className="flex gap-1.5">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        goToSlide(i, playing);
                      }}
                      className="w-2 h-2 rounded-full transition-all duration-200"
                      style={{
                        background:
                          i === slide
                            ? "var(--accent-cyan,#22d3ee)"
                            : "rgba(255,255,255,0.2)",
                        transform: i === slide ? "scale(1.4)" : "scale(1)",
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* prev / play-pause / next */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      goToSlide(
                        (slide - 1 + SLIDES.length) % SLIDES.length,
                        playing,
                      )
                    }
                    className="btn-icon !w-9 !h-9 text-sm"
                    aria-label="Previous"
                  >
                    <i className="bi bi-skip-start-fill" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="btn-brand !w-11 !h-11 !rounded-full !p-0 flex items-center justify-center"
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    <i
                      className={`bi ${playing ? "bi-pause-fill" : "bi-play-fill"} text-lg`}
                    />
                  </button>

                  <button
                    onClick={() =>
                      goToSlide((slide + 1) % SLIDES.length, playing)
                    }
                    className="btn-icon !w-9 !h-9 text-sm"
                    aria-label="Next"
                  >
                    <i className="bi bi-skip-end-fill" />
                  </button>
                </div>

                {/* slide label */}
                <span className="text-xs text-soft tabular-nums">
                  {slide + 1} / {SLIDES.length}
                </span>
              </div>

              {/* audio note */}
              <div className="px-6 pb-5 flex items-center gap-2 text-xs text-soft">
                <i
                  className={`bi ${playing ? "bi-volume-up-fill text-accent-cyan" : "bi-volume-mute"}`}
                />
                {playing
                  ? "Audio narration playing…"
                  : "Press play for audio narration"}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
