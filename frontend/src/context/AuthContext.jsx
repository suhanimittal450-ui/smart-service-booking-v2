import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser, logoutUser, getMe } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On first load, if a token exists, verify it against the backend
  // and restore the session. If the token is invalid/expired this
  // silently fails and the user lands on a logged-out state.
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const cachedUser = localStorage.getItem('user')

    if (!token) {
      setLoading(false)
      return
    }

    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser))
      } catch {
        // ignore corrupt cache
      }
    }

    getMe()
      .then((res) => {
        setUser(res.data.user)
        localStorage.setItem('user', JSON.stringify(res.data.user))
      })
      .catch(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const persistSession = (data) => {
    localStorage.setItem('accessToken', data.accessToken)
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const login = async (email, password) => {
    const res = await loginUser({ email, password })
    persistSession(res.data)
    return res.data.user
  }

  const signup = async (payload) => {
    const res = await registerUser(payload)
    persistSession(res.data)
    return res.data.user
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch {
      // ignore network errors on logout — clear local session regardless
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
