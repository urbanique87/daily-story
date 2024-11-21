import { JwtPayload } from "jsonwebtoken"

export interface Tokens {
  access: {
    token: string
    expires: number
  }
  refresh: {
    token: string
    expires: number
  }
}

export interface TokenPayload extends JwtPayload {
  id: string
  email: string
  type: "access" | "refresh"
}
