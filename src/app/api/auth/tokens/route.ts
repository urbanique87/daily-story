import { NextResponse } from "next/server"
// services
import { TokenService } from "@/lib/auth/token.service"

interface UserCredentials {
  id: string
  email: string
}

export async function POST(request: Request) {
  try {
    const credentials: UserCredentials = await request.json()
    const { id, email } = credentials

    // 토큰 생성
    const tokenService = new TokenService()
    const tokens = tokenService.generateTokenPair({
      id,
      email,
    })

    const { access, refresh } = tokens

    return NextResponse.json({
      message: "success",
      data: {
        accessToken: access.token,
        accessTokenExpires: access.expires,
        refreshToken: refresh.token,
        refreshTokenExpires: refresh.expires,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "토큰 생성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
