import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const roleLabel = { customer: 'Customer', provider: 'Service Provider', admin: 'Administrator' }
const roleIcon = { customer: 'bi-person-fill', provider: 'bi-tools', admin: 'bi-shield-lock-fill' }

export default function ProfileView() {
  const { user } = useAuth()

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-soft text-sm mt-1">Your account details.</p>
      </motion.div>

      <div className="bg-surface border-soft border rounded-2xl p-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <span
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: 'var(--grad-brand)' }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-display font-bold text-lg">{user.name}</p>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-surface-strong mt-1">
              <i className={`bi ${roleIcon[user.role]}`} /> {roleLabel[user.role]}
            </span>
          </div>
        </div>

        <dl className="space-y-4 text-sm">
          <div className="flex justify-between border-soft border-b pb-3">
            <dt className="text-soft">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div className="flex justify-between border-soft border-b pb-3">
            <dt className="text-soft">Role</dt>
            <dd className="font-medium">{roleLabel[user.role]}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-soft">Account ID</dt>
            <dd className="font-medium text-xs text-faint">{user._id}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
