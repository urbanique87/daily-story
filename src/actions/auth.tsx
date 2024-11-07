"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import jwt, { JwtPayload } from "jsonwebtoken"

interface AuthResponse {
  message: string
  data: {
    accessToken: string
    refreshToken: string
  }
}

export async function signup(formData: FormData) {
  try {
    // formData에서 이메일, 비밀번호 추출
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
      throw new Error("이메일과 비밀번호는 필수입니다.")
    }

    // 타입 검사
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("잘못된 입력 형식입니다.")
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`회원가입 실패: ${response.statusText}`)
    }

    const body: AuthResponse = await response.json()
    const { accessToken, refreshToken } = body.data

    // 페이지 데이터 갱신
    revalidatePath("/signup")

    // Refresh Token을 HTTP Only 쿠키로 저장
    await storeToken("refreshToken", refreshToken)

    // Access Token은 클라이언트에 반환
    return {
      success: true,
      accessToken,
    }
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}

// JWT 토큰에서 만료 시간을 추출하는 함수
function getTokenExpiration(token: string): Date | undefined {
  try {
    const decoded = jwt.decode(token, { complete: true })

    if (decoded === null) {
      return undefined
    }

    const exp = (decoded.payload as JwtPayload).exp
    if (exp === undefined) {
      return undefined
    }

    return new Date(exp * 1000) // `exp`는 UNIX 타임스탬프이므로 밀리초로 변환
  } catch (error) {
    console.error("토큰 디코딩 실패:", error)
  }

  return undefined // `exp`가 없으면 undefined 반환
}

export async function storeToken(name: string, value: string) {
  const expires = getTokenExpiration(value) ?? getDefaultExpiration()
  await setCookie(name, value, expires)
}

// 기본 만료 시간을 설정하는 함수
function getDefaultExpiration(): Date {
  const defaultExpiration = new Date()
  defaultExpiration.setDate(defaultExpiration.getDate() + 14) // 14일 뒤
  return defaultExpiration
}

// 쿠키를 설정하는 함수
async function setCookie(name: string, value: string, expires: Date) {
  await (
    await cookies()
  ).set({
    name,
    value,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    expires,
  })
}
