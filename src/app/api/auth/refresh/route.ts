import { NextResponse } from "next/server"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
// service
import { TokenService } from "@/service/token.service"

const prisma = new PrismaClient()

const secretKey = process.env.REFRESH_TOKEN_SECRET

export async function POST(request: Request) {
  try {
    const result = await request.json()
    const refreshToken = result.refreshToken

    // JWT 검증
    const decoded = jwt.verify(refreshToken, secretKey!) as JwtPayload

    // JWT에서 사용자 ID 추출
    const userId = decoded.id

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    // JWT 만료 여부 확인
    const tokenExpires = new Date() > new Date(decoded.exp! * 1000)
    if (tokenExpires) {
      return NextResponse.json(
        { message: "Refresh token is expired" },
        { status: 401 }
      )
    }

    // 사용자 정보가 없으면 404 반환
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // 토큰 생성
    const tokenService = new TokenService()
    const tokens = tokenService.generateTokenPair({
      id: user.id,
      email: user.email,
    })

    const { access, refresh } = tokens

    // 기존 토큰 업데이트
    // await prisma.token.update({
    //   where: { id: user.id },
    //   data: {
    //     accessToken: access.token,
    //     refreshToken: refresh.token,
    //     expiresAt: new Date(refresh.expiresAt),
    //   },
    // })

    // 새로운 액세스 토큰을 발급받는다.
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
    console.error("Error during POST request:", error)
    return NextResponse.json(
      { error: "토큰 생성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
