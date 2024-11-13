import { cookies } from "next/headers"
// lib
import { getTokenExpiration } from "@/lib/jwt"

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

// 토큰을 쿠키에 저장하는 함수
export async function storeToken(name: string, value: string) {
  const expires = getTokenExpiration(value) ?? getDefaultExpiration()
  await setCookie(name, value, expires)
}
