import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { AppRole } from '../types/auth'

interface ProtectedRouteProps {
  allowedRoles?: AppRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { status, role } = useAuth()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Checking session…
      </div>
    )
  }

  if (status !== 'authenticated' || !role) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'ADMIN' ? '/admin' : '/user'} replace />
  }

  return <Outlet />
}
