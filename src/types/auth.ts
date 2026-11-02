export type AppRole = 'ADMIN' | 'USER'

export interface JwtTokenPayload {
  token: string
}

export interface RefreshTokenPayload {
  token: string
}

export interface AuthTokenResponse {
  jwtToken: JwtTokenPayload
  refreshToken: RefreshTokenPayload
}

export interface JwtClaims {
  username?: string
  role?: AppRole
  exp?: number
  iat?: number
}

export interface UserInfo {
  userId: number
  userName: string
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  role: { id: number; name: AppRole }
}

export interface SignUpPayload {
  userName: string
  password: string
  firstName: string
  lastName: string
  email: string
}
