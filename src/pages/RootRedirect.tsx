import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function RootRedirect() {
  const { status, role } = useAuth()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Loading…
      </div>
    )
  }

  if (status !== 'authenticated' || !role) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={role === 'ADMIN' ? '/admin' : '/user'} replace />
}
