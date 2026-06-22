import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'

const roles = [
  { key: 'customer', label: 'Customer', icon: 'bi-person-fill' },
  { key: 'provider', label: 'Service Provider', icon: 'bi-tools' },
  { key: 'admin', label: 'Admin', icon: 'bi-shield-lock-fill' },
]

const dashboardPath = {
  customer: '/dashboard/customer',
  provider: '/dashboard/provider',
  admin: '/dashboard/admin',
}

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('customer')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', adminCode: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      }
      if (role === 'admin') payload.adminCode = form.adminCode

      const user = await signup(payload)
      navigate(dashboardPath[user.role] || '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Choose how you'll use Nexora"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold" style={{ color: 'var(--accent)' }}>
            Sign in
          </Link>
        </>
      }
    >
      {/* Role selector */}
      <div className="bg-surface border-soft border rounded-2xl p-1.5 flex gap-1.5 mb-6">
        {roles.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRole(r.key)}
            className="relative flex-1 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            style={{ color: role === r.key ? '#fff' : 'var(--text-dim)' }}
          >
            {role === r.key && (
              <motion.span
                layoutId="role-pill"
                className="absolute inset-0 rounded-xl -z-10"
                style={{ background: 'var(--grad-brand)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <i className={`bi ${r.icon} text-base`} />
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm border border-red-500/30 bg-red-500/10 text-red-400">
            <i className="bi bi-exclamation-circle me-2" />
            {error}
          </div>
        )}

        <div>
          <label className="text-sm text-soft mb-1.5 block">Full name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={onChange}
            placeholder="Jordan Lee"
            className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-soft mb-1.5 block">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-soft mb-1.5 block">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-soft mb-1.5 block">Confirm</label>
            <input
              type="password"
              name="confirm"
              required
              value={form.confirm}
              onChange={onChange}
              placeholder="••••••••"
              className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        {role === 'admin' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <label className="text-sm text-soft mb-1.5 block">Admin invite code</label>
            <input
              type="text"
              name="adminCode"
              required
              value={form.adminCode}
              onChange={onChange}
              placeholder="Provided by your organization"
              className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
            <p className="text-xs text-faint mt-1.5">
              Admin accounts require an invite code so the public can't self-promote to admin.
            </p>
          </motion.div>
        )}

        <button type="submit" disabled={loading} className="btn-brand w-full justify-center !py-3 disabled:opacity-60">
          {loading ? <i className="bi bi-arrow-repeat animate-spin" /> : `Create ${roles.find((r) => r.key === role).label} account`}
        </button>
      </form>
    </AuthLayout>
  )
}
