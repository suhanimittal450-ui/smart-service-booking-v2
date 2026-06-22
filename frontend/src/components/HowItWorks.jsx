import { motion } from 'framer-motion'

const steps = [
  { t: 'Create your account', d: 'Sign up in 30 seconds. No card required to start.', icon: 'bi-person-plus-fill' },
  { t: 'Search services', d: 'Filter by category, price, rating, or let AI pick for you.', icon: 'bi-search' },
  { t: 'Book in one tap', d: 'Pick a date, time, and confirm. Provider gets notified instantly.', icon: 'bi-lightning-charge-fill' },
  { t: 'Pay securely', d: 'Card, wallet, or split payments — fully encrypted.', icon: 'bi-shield-lock-fill' },
  { t: 'Enjoy the service', d: 'Track in real time, chat with your pro, and rate when done.', icon: 'bi-emoji-smile-fill' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 md:px-10 max-w-7xl mx-auto py-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-accent-cyan text-sm font-semibold mb-3">HOW IT WORKS</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold">From idea to booked in five steps.</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((s, index) => (
          <motion.div
            key={s.t}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="lift relative rounded-2xl border border-soft bg-surface p-7"
          >
            <span className="font-display text-4xl font-extrabold text-main opacity-10 absolute top-4 right-6">{index + 1}</span>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <i className={`bi ${s.icon} text-accent-cyan`} />
              <h3 className="font-display font-bold text-lg">{s.t}</h3>
            </div>
            <p className="text-soft text-sm relative z-10">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
