import { motion } from 'framer-motion'

export default function StatCard({ icon, label, value, tint = '124,58,237', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="lift bg-surface border-soft border rounded-2xl p-5"
    >
      <span
        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-3"
        style={{ background: `rgba(${tint},0.15)`, color: `rgb(${tint})` }}
      >
        <i className={`bi ${icon}`} />
      </span>
      <p className="text-2xl font-display font-bold">{value}</p>
      <p className="text-soft text-sm">{label}</p>
    </motion.div>
  )
}
