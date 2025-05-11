// src/types/auth.ts
interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  message: string
}

interface AuthUser {
  id: string
  email: string
}

export type { LoginRequest, LoginResponse, AuthUser }
