// lib
import { request } from "@/lib/request"
// types
import { Tokens } from "@/types/token.types"

/**
 * 제공된 리프레시 토큰을 사용하여 액세스 토큰을 갱신하는 함수
 */
export async function refreshAccessToken({
  refreshToken,
}: {
  refreshToken: string
}): Promise<Tokens | null> {
  try {
    const response = await request<Tokens>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    })

    return {
      accessToken: response.accessToken,
      accessTokenExpires: response.accessTokenExpires,
      refreshToken: response.refreshToken,
      refreshTokenExpires: response.refreshTokenExpires,
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)
    return null
  }
}
