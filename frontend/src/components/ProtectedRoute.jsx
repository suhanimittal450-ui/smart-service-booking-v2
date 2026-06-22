import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const homeForRole = {
  customer: '/dashboard/customer',
  provider: '/dashboard/provider',
  admin: '/dashboard/admin',
}

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-soft">
        <i className="bi bi-arrow-repeat animate-spin text-2xl" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in, but wrong role for this section — send them to their
  // own dashboard instead of the one they tried to reach. This is what
  // actually enforces "only admin can access everyone's data".
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={homeForRole[user.role] || '/'} replace />
  }

  return children
}
