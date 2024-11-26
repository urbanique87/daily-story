import { JwtPayload } from "jsonwebtoken"

export interface Tokens {
  accessToken: string
  accessTokenExpires: number
  refreshToken: string
  refreshTokenExpires: number
}

export interface TokenPayload extends JwtPayload {
  id: string
  email: string
  type: "access" | "refresh"
}
