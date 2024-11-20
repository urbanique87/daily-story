// lib
import { request } from "@/lib/request"
// types
import { Tokens } from "@/types/token.types"

/**
 * 사용자를 위한 신규 액세스 및 리프레시 토큰을 요청하는 함수
 */
export async function fetchTokens({
  userId,
  email,
}: {
  userId: string
  email: string
}): Promise<Tokens> {
  return await request<Tokens>("/api/auth/tokens", {
    method: "POST",
    body: JSON.stringify({
      id: userId,
      email,
    }),
  })
}
