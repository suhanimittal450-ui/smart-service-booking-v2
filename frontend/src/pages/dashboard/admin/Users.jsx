import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAllUsers, deleteUser } from '../../../api/users'
import { useAuth } from '../../../context/AuthContext'

const TABS = [
  { key: '', label: 'All' },
  { key: 'customer', label: 'Customers' },
  { key: 'provider', label: 'Providers' },
  { key: 'admin', label: 'Admins' },
]

export default function Users() {
  const { user: me } = useAuth()
  const [tab, setTab] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = (role) => {
    setLoading(true)
    getAllUsers(role)
      .then((res) => setUsers(res.data.users))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(tab) }, [tab])

  const onDelete = async (id) => {
    if (!confirm('Delete this account? This cannot be undone.')) return
    try {
      await deleteUser(id)
      load(tab)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete user')
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Users</h1>
        <p className="text-soft text-sm mt-1">Every account on the platform — only admins can see this.</p>
      </motion.div>

      <div className="bg-surface border-soft border rounded-2xl p-1.5 flex gap-1.5 mb-6 w-fit overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors"
            style={tab === t.key ? { background: 'var(--grad-brand)', color: '#fff' } : { color: 'var(--text-dim)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="bg-surface border-soft border rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-soft text-sm p-6">Loading…</p>
        ) : users.length === 0 ? (
          <p className="text-soft text-sm p-6">No users found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-soft border-b text-left text-faint text-xs uppercase">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-soft border-b last:border-0">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-soft">{u.email}</td>
                  <td className="p-4">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-surface-strong capitalize">{u.role}</span>
                  </td>
                  <td className="p-4 text-soft">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    {u._id !== me._id && (
                      <button onClick={() => onDelete(u._id)} className="text-xs font-medium text-red-400 hover:text-red-300">
                        <i className="bi bi-trash me-1" /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
