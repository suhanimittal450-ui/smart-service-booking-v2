import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'

const dashboardPath = {
  customer: '/dashboard/customer',
  provider: '/dashboard/provider',
  admin: '/dashboard/admin',
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(dashboardPath[user.role] || '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Nexora account"
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold" style={{ color: 'var(--accent)' }}>
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm border border-red-500/30 bg-red-500/10 text-red-400">
            <i className="bi bi-exclamation-circle me-2" />
            {error}
          </div>
        )}

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

        <button type="submit" disabled={loading} className="btn-brand w-full justify-center !py-3 disabled:opacity-60">
          {loading ? <i className="bi bi-arrow-repeat animate-spin" /> : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}
