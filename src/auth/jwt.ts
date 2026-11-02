import type { AppRole, JwtClaims } from '../types/auth'

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  return atob(padded + pad)
}

export function parseJwtClaims(token: string): JwtClaims | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const json = base64UrlDecode(parts[1])
    return JSON.parse(json) as JwtClaims
  } catch {
    return null
  }
}

export function getRoleFromJwt(token: string): AppRole | null {
  const role = parseJwtClaims(token)?.role
  return role === 'ADMIN' || role === 'USER' ? role : null
}

export function isJwtExpired(token: string, skewSeconds = 30): boolean {
  const claims = parseJwtClaims(token)
  const exp = claims?.exp
  if (!exp) return true
  const iat = claims?.iat
  const ttlSec = iat != null ? Math.max(1, exp - iat) : 3600
  const skew = Math.min(skewSeconds, Math.floor(ttlSec / 2))
  return Date.now() >= (exp - skew) * 1000
}
