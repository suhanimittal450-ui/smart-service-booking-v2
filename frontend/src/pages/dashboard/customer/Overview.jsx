import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCustomerDashboard } from '../../../api/users'
import { useAuth } from '../../../context/AuthContext'
import StatCard from '../../../components/dashboard/StatCard'
import StatusBadge from '../../../components/dashboard/StatusBadge'

export default function CustomerOverview() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getCustomerDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Welcome back, {user.name.split(' ')[0]} 👋</h1>
        <p className="text-soft text-sm mt-1">Here's what's happening with your bookings.</p>
      </motion.div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="bi-calendar2-week-fill" label="Total bookings" value={data?.stats.totalBookings ?? '—'} tint="0,229,255" index={0} />
        <StatCard icon="bi-hourglass-split" label="Pending" value={data?.stats.pending ?? '—'} tint="255,159,28" index={1} />
        <StatCard icon="bi-check-circle-fill" label="Completed" value={data?.stats.completed ?? '—'} tint="0,208,132" index={2} />
      </div>

      <div className="bg-surface border-soft border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg">Recent bookings</h2>
          <Link to="/dashboard/customer/bookings" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            View all
          </Link>
        </div>

        {!data ? (
          <p className="text-soft text-sm">Loading…</p>
        ) : data.recentBookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {data.recentBookings.map((b) => (
              <div key={b._id} className="flex items-center justify-between gap-4 border-soft border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-sm">{b.service?.title}</p>
                  <p className="text-xs text-faint">with {b.provider?.name} · {new Date(b.bookingDate).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-10">
      <i className="bi bi-calendar2-x text-3xl text-faint mb-3 block" />
      <p className="text-soft text-sm mb-4">No bookings yet.</p>
      <Link to="/dashboard/customer/services" className="btn-brand !py-2 !px-4 text-sm">
        Browse services
      </Link>
    </div>
  )
}
