import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loginRequest,
  logoutRequest,
  persistAuthResponse,
  refreshSession,
  signInRequest,
} from '../api/authApi'
import { getRoleFromJwt } from './jwt'
import {
  clearStoredTokens,
  getStoredJwt,
  hasStoredSession,
} from './tokenStorage'
import type { AppRole, SignUpPayload } from '../types/auth'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  status: AuthStatus
  role: AppRole | null
  login: (username: string, password: string) => Promise<AppRole>
  signUp: (payload: SignUpPayload) => Promise<AppRole>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [role, setRole] = useState<AppRole | null>(null)

  const syncRoleFromStorage = useCallback(() => {
    const jwt = getStoredJwt()
    if (!jwt) {
      setRole(null)
      return
    }
    setRole(getRoleFromJwt(jwt))
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!hasStoredSession()) {
        if (!cancelled) {
          setStatus('unauthenticated')
          setRole(null)
        }
        return
      }

      const ok = await refreshSession()
      if (cancelled) return

      if (!ok) {
        clearStoredTokens()
        setStatus('unauthenticated')
        setRole(null)
        return
      }

      syncRoleFromStorage()
      setStatus('authenticated')
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [syncRoleFromStorage])

  const login = useCallback(
    async (username: string, password: string) => {
      const tokens = await loginRequest(username, password)
      persistAuthResponse(tokens)
      const nextRole = getRoleFromJwt(tokens.jwtToken.token)
      if (!nextRole) {
        throw new Error('Missing role in token')
      }
      setRole(nextRole)
      setStatus('authenticated')
      return nextRole
    },
    [],
  )

  const signUp = useCallback(async (payload: SignUpPayload) => {
      const tokens = await signInRequest(payload)
      persistAuthResponse(tokens)
      const nextRole = getRoleFromJwt(tokens.jwtToken.token)
      if (!nextRole) {
        throw new Error('Missing role in token')
      }
      setRole(nextRole)
      setStatus('authenticated')
      return nextRole
    },
    [],
  )

  const logout = useCallback(async () => {
    await logoutRequest()
    setRole(null)
    setStatus('unauthenticated')
  }, [])

  const value = useMemo(
    () => ({ status, role, login, signUp, logout }),
    [status, role, login, signUp, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
