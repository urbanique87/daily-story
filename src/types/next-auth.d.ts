import type { NextRequest } from "next/server"
import type { DefaultUser, DefaultSession } from "next-auth"

declare module "next-auth" {
  export interface NextAuthRequest extends NextRequest {
    auth: Session | null
  }

  interface User extends DefaultUser {
    id: string
    email: string
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    refreshTokenExpires?: number
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      name: string | null
      email: string
      image: string | null
    }
    accessToken?: string
    refreshToken?: string
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    accessToken?: string
    refreshToken?: string
    error?: string
  }
}
