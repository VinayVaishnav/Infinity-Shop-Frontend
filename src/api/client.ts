import { apiUrl } from './apiBase'
import { isJwtExpired } from '../auth/jwt'
import { getStoredJwt, getStoredRefresh } from '../auth/tokenStorage'
import { refreshSession } from './authApi'

let refreshInFlight: Promise<boolean> | null = null

async function ensureFreshJwt(): Promise<string | null> {
  const jwt = getStoredJwt()
  const refresh = getStoredRefresh()
  if (!jwt || !refresh) return null

  if (!isJwtExpired(jwt)) {
    return jwt
  }

  if (!refreshInFlight) {
    refreshInFlight = refreshSession().finally(() => {
      refreshInFlight = null
    })
  }

  const ok = await refreshInFlight
  return ok ? getStoredJwt() : null
}

export async function authFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const jwt = await ensureFreshJwt()
  if (!jwt) {
    return new Response(null, { status: 401 })
  }

  const withJwt = (token: string) =>
    fetch(apiUrl(input), {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        jwtToken: token,
      },
    })

  let response = await withJwt(jwt)

  if (response.status === 401 || response.status === 403) {
    const refreshed = await refreshSession()
    const nextJwt = refreshed ? getStoredJwt() : null
    if (!nextJwt) {
      return response
    }
    response = await withJwt(nextJwt)
  }

  return response
}
