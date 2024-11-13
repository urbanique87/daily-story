import jwt from "jsonwebtoken"
// types
import type { JwtPayload } from "jsonwebtoken"

// JWT 토큰에서 만료 시간을 추출하는 함수
export function getTokenExpiration(token: string): Date | undefined {
  try {
    const decoded = jwt.decode(token, { complete: true })
    if (decoded === null) {
      return
    }

    const exp = (decoded.payload as JwtPayload).exp
    if (exp === undefined) {
      return
    }

    return new Date(exp * 1000) // `exp`는 UNIX 타임스탬프이므로 밀리초로 변환
  } catch (error) {
    console.error("토큰 디코딩 실패:", error)
  }

  return
}
