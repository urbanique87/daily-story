interface refreshAccessTokenParams {
  refreshToken: string
  refreshTokenExpires: number
}

interface RefreshTokenResponse {
  accessToken: string
  accessTokenExpires: number
  refreshToken: string
  refreshTokenExpires: number
}

export async function refreshAccessToken({
  refreshToken,
  refreshTokenExpires,
}: refreshAccessTokenParams): Promise<RefreshTokenResponse | null> {
  try {
    // 리프레시 토큰이 만료되었는지 확인
    if (Date.now() > refreshTokenExpires) {
      return null
    }

    // 새로운 액세스 토큰 발급 요청
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      }
    )

    const result = await response.json()
    if (!response.ok) {
      throw new Error("Failed to refresh access token")
    }

    return {
      accessToken: result.data.accessToken,
      accessTokenExpires: result.data.accessTokenExpires,
      refreshToken: result.data.refreshToken,
      refreshTokenExpires: result.data.refreshTokenExpires,
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)
    return null
  }
}
