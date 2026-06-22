import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_PROMPTS = [
  "What services are available?",
  "How do I book a service?",
  "Is my payment safe?",
  "How do I cancel a booking?",
];

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hey! 👋 I'm your Nexora AI Concierge. I can help you with booking services, tracking your orders, payments, cancellations, or anything else about Nexora. What would you like to know?",
};

// ✅ Backend base URL — same as rest of the app
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AIWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // ✅ Build messages array for backend (skip the initial assistant greeting)
      const apiMessages = newMessages
        .filter((_, idx) => idx !== 0) // skip initial greeting
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      console.error("AI Widget error:", err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please try again in a moment! 🙏",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([INITIAL_MESSAGE]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="mb-4 w-80 md:w-96 rounded-3xl border border-soft bg-surface shadow-2xl overflow-hidden flex flex-col"
            style={{ height: "520px", backdropFilter: "blur(20px)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{
                background:
                  "var(--grad-brand, linear-gradient(135deg,#7c3aed,#06b6d4))",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                  ✦
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Nexora AI</p>
                  <p className="text-white/70 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    Online · Always here
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  title="Clear chat"
                >
                  <i className="bi bi-arrow-counterclockwise text-white text-sm" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                >
                  <i className="bi bi-x-lg text-white text-sm" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <span
                      className="w-7 h-7 rounded-full shrink-0 mr-2 mt-0.5 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "var(--grad-brand)" }}
                    >
                      ✦
                    </span>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${msg.role === "user" ? "rounded-br-sm text-white" : "rounded-bl-sm border border-soft text-main"}`}
                    style={
                      msg.role === "user"
                        ? { background: "var(--grad-brand)" }
                        : {
                            background:
                              "var(--color-surface-2, rgba(255,255,255,0.05))",
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <span
                    className="w-7 h-7 rounded-full shrink-0 mr-2 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "var(--grad-brand)" }}
                  >
                    ✦
                  </span>
                  <div
                    className="border border-soft rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1"
                    style={{
                      background:
                        "var(--color-surface-2, rgba(255,255,255,0.05))",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--accent-cyan, #22d3ee)" }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.15,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-soft hover:border-accent-cyan transition-colors text-soft hover:text-main"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 pt-2 shrink-0 border-t border-soft">
              <div
                className="flex items-center gap-2 rounded-2xl border border-soft px-3 py-2 focus-within:border-accent-cyan transition-colors"
                style={{
                  background: "var(--color-surface-2, rgba(255,255,255,0.04))",
                }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask me anything about Nexora…"
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-soft"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: "var(--grad-brand)" }}
                  aria-label="Send"
                >
                  <i className="bi bi-send-fill text-white text-xs" />
                </button>
              </div>
              <p
                className="text-center text-soft"
                style={{ fontSize: "10px", marginTop: "6px" }}
              >
                Powered by Claude AI · Nexora Concierge
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        aria-label="Open AI assistant"
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{ background: "var(--grad-brand)" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "tween", duration: 0.15 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.i
              key="close"
              className="bi bi-x-lg text-xl"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <motion.span
              key="icon"
              className="text-2xl"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              ✦
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {!open && (
        <motion.span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: "2px solid var(--accent, #7c3aed)" }}
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
    </div>
  );
}
