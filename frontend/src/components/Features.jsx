import { motion } from 'framer-motion'

const features = [
  { icon: 'bi-lightning-charge-fill', t: 'Instant booking', d: 'Confirmed in under 60 seconds with smart slot matching.' },
  { icon: 'bi-cpu-fill', t: 'AI recommendations', d: 'Personalized providers ranked by fit, rating, and price.' },
  { icon: 'bi-shield-lock-fill', t: 'Secure payments', d: 'PCI-compliant card, wallet, and split payment support.' },
  { icon: 'bi-patch-check-fill', t: 'Verified providers', d: 'Every pro is background-checked and continuously rated.' },
  { icon: 'bi-geo-alt-fill', t: 'Live tracking', d: 'See your provider on the map from request to arrival.' },
  { icon: 'bi-bell-fill', t: 'Real-time alerts', d: 'Push, SMS, and email notifications you actually want.' },
]

export default function Features() {
  return (
    <section id="features" className="relative px-6 md:px-10 max-w-7xl mx-auto py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-accent-cyan text-sm font-semibold mb-3">WHY NEXORA</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold">Built for the way you actually book</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, index) => (
          <motion.div
            key={f.t}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.06 }}
            className="lift rounded-2xl border border-soft bg-surface p-6"
          >
            <span className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-accent-purple/25 to-accent-cyan/10 border border-soft flex items-center justify-center text-accent-cyan text-xl mb-4">
              <i className={`bi ${f.icon}`} />
            </span>
            <h3 className="font-display font-semibold mb-2">{f.t}</h3>
            <p className="text-soft text-sm">{f.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
