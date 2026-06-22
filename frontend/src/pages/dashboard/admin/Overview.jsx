import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAdminDashboard } from '../../../api/users'
import { useAuth } from '../../../context/AuthContext'
import StatCard from '../../../components/dashboard/StatCard'
import StatusBadge from '../../../components/dashboard/StatusBadge'

export default function AdminOverview() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Platform overview</h1>
        <p className="text-soft text-sm mt-1">Welcome, {user.name.split(' ')[0]}. You have full visibility across Nexora.</p>
      </motion.div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="bi-people-fill" label="Total users" value={data?.stats.totalUsers ?? '—'} tint="124,58,237" index={0} />
        <StatCard icon="bi-person-fill" label="Customers" value={data?.stats.totalCustomers ?? '—'} tint="0,229,255" index={1} />
        <StatCard icon="bi-tools" label="Providers" value={data?.stats.totalProviders ?? '—'} tint="255,159,28" index={2} />
        <StatCard icon="bi-cash-coin" label="Revenue" value={`$${data?.stats.revenue ?? 0}`} tint="0,208,132" index={3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-surface border-soft border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg">Recent users</h2>
            <Link to="/dashboard/admin/users" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Manage</Link>
          </div>
          {!data ? <p className="text-soft text-sm">Loading…</p> : (
            <div className="space-y-3">
              {data.recentUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between border-soft border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-faint">{u.email}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-surface-strong capitalize">{u.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border-soft border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg">Recent bookings</h2>
            <Link to="/dashboard/admin/bookings" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>View all</Link>
          </div>
          {!data ? <p className="text-soft text-sm">Loading…</p> : (
            <div className="space-y-3">
              {data.recentBookings.map((b) => (
                <div key={b._id} className="flex items-center justify-between border-soft border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{b.service?.title}</p>
                    <p className="text-xs text-faint">{b.customer?.name} → {b.provider?.name}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
