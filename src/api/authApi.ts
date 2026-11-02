import type { AuthTokenResponse, JwtTokenPayload, SignUpPayload } from '../types/auth'
import { apiUrl } from './apiBase'
import {
  clearStoredTokens,
  getStoredJwt,
  getStoredRefresh,
  setStoredJwt,
  setStoredTokens,
} from '../auth/tokenStorage'

export class AuthError extends Error {
  constructor(message = 'Authentication failed') {
    super(message)
    this.name = 'AuthError'
  }
}

export async function loginRequest(
  username: string,
  password: string,
): Promise<AuthTokenResponse> {
  const res = await fetch(apiUrl('/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (res.status === 401) {
    throw new AuthError('Invalid username or password')
  }
  if (res.status === 400) {
    throw new AuthError('Incorrect password')
  }
  if (!res.ok) {
    throw new AuthError('Login failed')
  }
  return (await res.json()) as AuthTokenResponse
}

export async function signInRequest(payload: SignUpPayload): Promise<AuthTokenResponse> {
  const res = await fetch(apiUrl('/signin'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.status === 400) {
    throw new AuthError('Username or email already exists')
  }
  if (!res.ok) {
    throw new AuthError('Sign up failed')
  }
  return (await res.json()) as AuthTokenResponse
}

export function persistAuthResponse(tokens: AuthTokenResponse): void {
  setStoredTokens(tokens.jwtToken.token, tokens.refreshToken.token)
}

/** Revokes refresh token on the server and clears local session. */
export async function logoutRequest(): Promise<void> {
  const jwtToken = getStoredJwt()
  const refreshToken = getStoredRefresh()

  try {
    if (refreshToken) {
      await fetch(apiUrl('/logout'), {
        method: 'POST',
        headers: {
          refreshToken,
          ...(jwtToken ? { jwtToken } : {}),
        },
      })
    }
  } finally {
    clearStoredTokens()
  }
}

/** Calls GET /auth; updates stored JWT when the backend issues a new one. */
export async function refreshSession(): Promise<boolean> {
  const jwtToken = getStoredJwt()
  const refreshToken = getStoredRefresh()
  if (!jwtToken || !refreshToken) {
    return false
  }

  const res = await fetch(apiUrl('/auth'), {
    method: 'GET',
    headers: {
      jwtToken,
      refreshToken,
    },
  })

  if (res.status === 401) {
    clearStoredTokens()
    return false
  }

  if (!res.ok) {
    return false
  }

  const text = await res.text()
  if (!text) {
    return true
  }

  try {
    const payload = JSON.parse(text) as JwtTokenPayload
    if (payload.token) {
      setStoredJwt(payload.token)
    }
    return true
  } catch {
    return false
  }
}
