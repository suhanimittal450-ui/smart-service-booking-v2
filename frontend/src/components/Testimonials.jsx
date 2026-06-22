import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Diego Hernandez",
    role: "Startup Founder",
    initial: "D",
    color: "bg-blue-500",
    text: "Nexora replaced four different apps I used to juggle. The provider quality is consistently incredible and payments just work.",
  },
  {
    name: "Priya Sharma",
    role: "Marketing Lead",
    initial: "P",
    color: "bg-violet-500",
    text: "Live tracking is a game changer — I always know exactly when my pro is arriving. The whole experience feels like a ride app, but for everything.",
  },
  {
    name: "Marcus Lin",
    role: "Engineering Manager",
    initial: "M",
    color: "bg-emerald-500",
    text: "I've used Nexora 23 times in the last six months. Every single booking has been smooth. Easiest 5 stars I've ever given.",
  },
  {
    name: "Sara Patel",
    role: "Product Designer",
    initial: "S",
    color: "bg-pink-500",
    text: "Booked a house cleaner in under 2 minutes. The AI suggestion was spot-on — she was amazing. Will use every week.",
  },
  {
    name: "James Okafor",
    role: "Freelance Dev",
    initial: "J",
    color: "bg-amber-500",
    text: "The real-time tracking and instant payment confirmation gives me so much confidence. No more chasing people down.",
  },
  {
    name: "Ananya Roy",
    role: "Content Creator",
    initial: "A",
    color: "bg-cyan-500",
    text: "Found a tutor for my kids in one search. Nexora matched perfectly based on their level. Genuinely impressed!",
  },
];

// Triplicate so loop never shows a gap
const ITEMS = [...reviews, ...reviews, ...reviews];

export default function Testimonials() {
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const dirRef = useRef(1); // 1 = scroll left, -1 = scroll right
  const pausedRef = useRef(false);
  const rafRef = useRef(null);
  const SPEED = 0.6; // px per frame (~36px/sec @60fps)

  const [activeIdx, setActiveIdx] = useState(null);

  /* ── main animation loop ── */
  useEffect(() => {
    const step = () => {
      const track = trackRef.current;
      if (track && !pausedRef.current) {
        posRef.current += SPEED * dirRef.current;
        const third = track.scrollWidth / 3;

        /* seamless infinite: when we've scrolled one full copy, reset */
        if (dirRef.current === 1 && posRef.current >= third * 2) {
          posRef.current = third;
        } else if (dirRef.current === -1 && posRef.current <= third) {
          posRef.current = third * 2;
        }

        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    /* start in the middle copy so both directions have room */
    const track = trackRef.current;
    if (track) {
      posRef.current = track.scrollWidth / 3;
      track.style.transform = `translateX(-${posRef.current}px)`;
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── auto direction flip every 4 seconds ── */
  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) {
        dirRef.current = dirRef.current === 1 ? -1 : 1;
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const onEnter = (i) => {
    pausedRef.current = true;
    setActiveIdx(i);

    /* flip direction based on which end of the visible strip this card is */
    const realIdx = i % reviews.length;
    if (realIdx === reviews.length - 1)
      dirRef.current = -1; // last card → go right
    else if (realIdx === 0) dirRef.current = 1; // first card → go left
  };

  const onLeave = () => {
    pausedRef.current = false;
    setActiveIdx(null);
  };

  return (
    <section id="reviews" className="relative py-20 overflow-hidden">
      {/* Heading */}
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-medium px-3 py-1.5 rounded-full border border-soft bg-surface text-soft mb-4">
            💬 LOVED BY THOUSANDS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Real reviews from{" "}
            <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
              real customers
            </span>
          </h2>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* left fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-28 z-10"
          style={{
            background:
              "linear-gradient(to right, var(--color-bg, #0d0d14), transparent)",
          }}
        />
        {/* right fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-28 z-10"
          style={{
            background:
              "linear-gradient(to left, var(--color-bg, #0d0d14), transparent)",
          }}
        />

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-5 w-max py-3"
            style={{ willChange: "transform" }}
          >
            {ITEMS.map((r, i) => (
              <motion.div
                key={i}
                onMouseEnter={() => onEnter(i)}
                onMouseLeave={onLeave}
                animate={{
                  scale: activeIdx === i ? 1.05 : 1,
                  opacity: activeIdx !== null && activeIdx !== i ? 0.6 : 1,
                }}
                transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                className="rounded-2xl border border-soft bg-surface p-6 flex flex-col shrink-0 cursor-default shadow-sm"
                style={{ width: "300px" }}
              >
                <p className="text-accent-cyan mb-3 text-base">★★★★★</p>
                <p className="text-sm leading-relaxed mb-5 flex-1">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-soft">
                  <span
                    className={`w-9 h-9 rounded-full ${r.color} flex items-center justify-center font-semibold text-sm text-white shrink-0`}
                  >
                    {r.initial}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{r.name}</p>
                    <p className="text-soft text-xs">{r.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {reviews.map((_, i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{
              background:
                activeIdx !== null && i === activeIdx % reviews.length
                  ? "var(--accent-cyan, #22d3ee)"
                  : "transparent",
              border: "1px solid var(--accent-cyan, #22d3ee)",
              opacity:
                activeIdx !== null && i === activeIdx % reviews.length
                  ? 1
                  : 0.4,
            }}
          />
        ))}
      </div>
    </section>
  );
}
