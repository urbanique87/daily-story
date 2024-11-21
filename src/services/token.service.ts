import jwt from "jsonwebtoken"
// config
import { AUTH_CONFIG } from "@/config/auth.config"
// types
import type { ApiResponse } from "@/types/response.types"
import type { TokenPayload, Tokens } from "@/types/token.types"
import { ErrorCode } from "@/types/error.types"
// lib
import { prisma } from "@/lib/prisma"

// ----------------------------------------------------------------------

function getSecretForTokenType(type: "access" | "refresh"): string {
  return type === "access"
    ? process.env.ACCESS_TOKEN_SECRET || ""
    : process.env.REFRESH_TOKEN_SECRET || ""
}

// ----------------------------------------------------------------------

/**
 * 토큰 생성
 */
export function generateToken(
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
    return {
      token,
      expires: exp!,
    }
  } catch (error) {
    console.error("토큰 생성 중 오류 발생: ", error)
    throw new Error("토큰 생성 중 오류가 발생했습니다: ")
  }
}

// ----------------------------------------------------------------------

/**
 * 토큰 페어 생성
 */
export function generateTokenPair(
  payload: Omit<TokenPayload, "type">
): ApiResponse<Tokens> {
  try {
    return {
      success: true,
      message: "토큰이 성공적으로 생성되었습니다.",
      data: {
        access: generateToken(payload, "access"),
        refresh: generateToken(payload, "refresh"),
      },
    }
  } catch (error) {
    console.error("토큰 생성 중 오류 발생: ", error)
    return {
      success: false,
      message: "토큰 생성 중 오류가 발생했습니다.",
      data: null,
      error: ErrorCode.INTERNAL_SERVER_ERROR,
    }
  }
}

// ----------------------------------------------------------------------

/**
 * 토큰 검증
 */
export function verifyToken(
  token: string,
  type: "access" | "refresh"
): ApiResponse<{ id: string }> {
  const secret = getSecretForTokenType(type)

  try {
    const payload = jwt.verify(token, secret) as TokenPayload
    if (!payload.exp) {
      return {
        success: false,
        message: "토큰의 유효기간 정보가 없습니다.",
        data: null,
        error: ErrorCode.UNAUTHORIZED,
      }
    }

    const tokenExpires = new Date() > new Date(payload.exp * 1000)
    if (tokenExpires) {
      return {
        success: false,
        message: "토큰이 만료되었습니다.",
        data: null,
        error: ErrorCode.UNAUTHORIZED,
      }
    }

    return {
      success: true,
      message: "토큰이 성공적으로 검증되었습니다.",
      data: {
        id: payload.id,
      },
    }
  } catch (error) {
    console.error("토큰 검증 중 오류 발생: ", error)
    return {
      success: false,
      message: "유효하지 않은 토큰입니다.",
      data: null,
      error: ErrorCode.UNAUTHORIZED,
    }
  }
}

// ----------------------------------------------------------------------

/**
 * 액세스 토큰 재발급
 */
export async function refreshAccessToken({
  refreshToken,
}: {
  refreshToken: string
}): Promise<ApiResponse<Tokens>> {
  try {
    // JWT 검증
    const result = verifyToken(refreshToken, "refresh")
    if (!result.data) {
      return {
        success: false,
        message: "유효하지 않은 토큰입니다.",
        data: null,
        error: ErrorCode.UNAUTHORIZED,
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: result.data.id },
    })

    if (!user) {
      return {
        success: false,
        message:
          "사용자를 찾을 수 없습니다. 해당 ID에 일치하는 사용자가 없습니다.",
        data: null,
        error: ErrorCode.UNAUTHORIZED,
      }
    }

    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
    })

    if (!tokens.data) {
      return {
        success: false,
        message: "토큰 생성을 실패했습니다.",
        data: null,
        error: ErrorCode.INTERNAL_SERVER_ERROR,
      }
    }

    return {
      success: true,
      message: "토큰을 성공적으로 생성했습니다.",
      data: tokens.data,
    }
  } catch (error) {
    console.error("토큰 생성 중 오류 발생: ", error)

    return {
      success: false,
      message: "토큰 생성을 실패했습니다.",
      data: null,
      error: ErrorCode.INTERNAL_SERVER_ERROR,
    }
  }
}
