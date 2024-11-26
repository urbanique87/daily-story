import jwt from "jsonwebtoken"
// config
import { AUTH_CONFIG } from "@/config/auth.config"
// types
import type { TokenPayload, Tokens } from "@/types/token.types"
// utils
import { AppError } from "@/utils/errors/custom.error"
// lib
import { prisma } from "@/lib/prisma"
// constants
import { ErrorCodeMap } from "@/constants/error"

// ----------------------------------------------------------------------

function getSecretForTokenType(type: "access" | "refresh"): string {
  return type === "access"
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET
}

// ----------------------------------------------------------------------

/**
 * 토큰 생성
 */
export function issueToken(
  payload: Omit<TokenPayload, "type">,
  type: "access" | "refresh"
): { token: string; expires: number } {
  const config =
    type === "access" ? AUTH_CONFIG.ACCESS_TOKEN : AUTH_CONFIG.REFRESH_TOKEN

  const secret = getSecretForTokenType(type)

  try {
    const token = jwt.sign({ ...payload, type }, secret, {
      expiresIn: config.EXPIRES_IN,
      algorithm: config.ALGORITHM,
    })

    // 토큰의 exp 클레임 추출
    const { exp } = jwt.decode(token) as jwt.JwtPayload
    if (!exp) {
      throw new AppError(ErrorCodeMap.TOKEN_GENERATION_FAILED.code)
    }
    return { token, expires: exp }
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError(
          ErrorCodeMap.ERROR_UNKNOWN.code,
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."
        )
  }
}

// ----------------------------------------------------------------------

/**
 * 토큰 페어 생성
 */
export function issueTokenPair(payload: Omit<TokenPayload, "type">): Tokens {
  try {
    const acceess = issueToken(payload, "access")
    const refresh = issueToken(payload, "refresh")

    return {
      accessToken: acceess.token,
      accessTokenExpires: acceess.expires,
      refreshToken: refresh.token,
      refreshTokenExpires: refresh.expires,
    }
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError(
          ErrorCodeMap.ERROR_UNKNOWN.code,
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."
        )
  }
}

// ----------------------------------------------------------------------

/**
 * 토큰 검증
 */
export function validateToken(
  token: string,
  type: "access" | "refresh"
): { id: string } {
  const secret = getSecretForTokenType(type)

  try {
    const payload = jwt.verify(token, secret) as TokenPayload
    if (!payload.exp) {
      throw new AppError(ErrorCodeMap.TOKEN_EMPTY_EXPIRES.code)
    }

    const tokenExpires = new Date() > new Date(payload.exp * 1000)
    if (tokenExpires) {
      throw new AppError(ErrorCodeMap.SESSION_EXPIRED.code)
    }

    return { id: payload.id }
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError(
          ErrorCodeMap.ERROR_UNKNOWN.code,
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."
        )
  }
}

// ----------------------------------------------------------------------

/**
 * 액세스 토큰 재발급
 */
export async function reissueAccessToken({
  refreshToken,
}: {
  refreshToken: string
}): Promise<Tokens> {
  try {
    // JWT 검증
    const { id } = validateToken(refreshToken, "refresh")

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    })

    if (!user) {
      throw new AppError(ErrorCodeMap.AUTH_USER_NOT_FOUND.code)
    }

    return issueTokenPair({
      id: user.id,
      email: user.email,
    })
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError(
          ErrorCodeMap.ERROR_UNKNOWN.code,
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."
        )
  }
}
