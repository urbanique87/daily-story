import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { PrismaClient } from "@prisma/client"
// services
import { TokenService } from "@/service/token.service"

interface UserCredentials {
  email: string
  password: string
}

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const credentials: UserCredentials = await request.json()
    const { email, password } = credentials

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // 비밀번호 해시화
    const hashedPassword = await hash(password, 10)

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    // 토큰 생성
    const tokenService = new TokenService()
    const tokens = tokenService.generateTokenPair({
      id: user.id,
      email,
    })

    const { access, refresh } = tokens

    // 토큰 저장
    await prisma.token.create({
      data: {
        accessToken: access.token,
        refreshToken: refresh.token,
        userId: user.id,
        expiresAt: new Date(refresh.expiresAt),
      },
    })

    return NextResponse.json({
      message: "success",
      data: {
        accessToken: access.token,
        refreshToken: refresh.token,
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
