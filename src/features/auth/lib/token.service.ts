import jwt from "jsonwebtoken"
// config
import { AUTH_CONFIG } from "@/shared/config"
// lib
import { getEnv } from "@/shared/lib"

export interface TokenPayload {
  id: number
  email: string
  type: "access" | "refresh"
}

export class TokenService {
  private accessTokenSecret: string
  private refreshTokenSecret: string

  constructor() {
    this.accessTokenSecret = getEnv("NEXT_PUBLIC_ACCESS_TOKEN_SECRET")
    this.refreshTokenSecret = getEnv("NEXT_PUBLIC_REFRESH_TOKEN_SECRET")
  }

  // 토큰 생성
  private generateToken(
    payload: Omit<TokenPayload, "type">,
    type: TokenPayload["type"]
  ): string {
    const config =
      type === "access" ? AUTH_CONFIG.ACCESS_TOKEN : AUTH_CONFIG.REFRESH_TOKEN

    const secret =
      type === "access" ? this.accessTokenSecret : this.refreshTokenSecret

    try {
      return jwt.sign({ ...payload, type }, secret, {
        expiresIn: config.EXPIRES_IN,
        algorithm: config.ALGORITHM,
      })
    } catch (error) {
      console.error(error)
      throw new Error("토큰 생성 중 오류가 발생했습니다.")
    }
  }

  // 토큰 페어
  generateTokenPair(payload: Omit<TokenPayload, "type">) {
    return {
      accessToken: this.generateToken(payload, "access"),
      refreshToken: this.generateToken(payload, "refresh"),
    }
  }

  // 토큰 검증
  verifyToken(token: string, type: TokenPayload["type"]): TokenPayload {
    try {
      const secret =
        type === "access" ? this.accessTokenSecret : this.refreshTokenSecret
      return jwt.verify(token, secret) as TokenPayload
    } catch (error) {
      console.error(error)
      throw new Error("유효하지 않은 토큰입니다.")
    }
  }
}
