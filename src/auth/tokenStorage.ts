const JWT_KEY = 'myproj.jwt'
const REFRESH_KEY = 'myproj.refresh'

export function getStoredJwt(): string | null {
  return localStorage.getItem(JWT_KEY)
}

export function getStoredRefresh(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

export function setStoredTokens(jwt: string, refresh: string): void {
  localStorage.setItem(JWT_KEY, jwt)
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function setStoredJwt(jwt: string): void {
  localStorage.setItem(JWT_KEY, jwt)
}

export function clearStoredTokens(): void {
  localStorage.removeItem(JWT_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function hasStoredSession(): boolean {
  return Boolean(getStoredJwt() && getStoredRefresh())
}
