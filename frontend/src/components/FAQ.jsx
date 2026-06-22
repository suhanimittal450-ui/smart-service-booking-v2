import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const faqs = [
  { q: 'How fast can I book a service?', a: 'Most bookings are confirmed in under 60 seconds. Our AI matches you with available pros instantly based on your location, schedule, and preferences.' },
  { q: 'Are all providers verified?', a: 'Yes. Every Nexora provider passes identity verification, background checks, and is continuously rated by real customers.' },
  { q: 'What payment methods are supported?', a: 'Major credit/debit cards, Apple Pay, Google Pay, and digital wallets, all processed through PCI-DSS compliant infrastructure.' },
  { q: 'Can I cancel or reschedule?', a: 'Yes — free cancellation up to 2 hours before the booking. Rescheduling is unlimited and works in two taps.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="relative px-6 md:px-10 max-w-3xl mx-auto py-20">
      <div className="text-center mb-12">
        <p className="text-accent-cyan text-sm font-semibold mb-3">QUESTIONS</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold">Frequently asked questions</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((item, i) => {
          const isOpen = open === i
          return (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-soft bg-surface overflow-hidden"
            >
              <div
                className="w-full flex items-center justify-between text-left px-6 py-5 font-medium cursor-pointer"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <motion.i
                  className="bi bi-plus-lg text-accent-cyan"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="px-6 pb-5 text-soft text-sm">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
