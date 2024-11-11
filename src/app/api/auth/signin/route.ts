import { NextResponse } from "next/server"
import { compare, hash } from "bcrypt"
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

    // 회원이 있는지 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser === null) {
      return NextResponse.json({ error: "No matching users." }, { status: 404 }) // 코드 무엇?
    }

    // 비밀번호 일치하는지 확인
    const isCorrectPassword = await compare(password, existingUser.password)
    if (isCorrectPassword === false) {
      return NextResponse.json(
        { error: "Password does not match." },
        { status: 404 } // 코드 무엇?
      )
    }

    // 토큰 생성
    const tokenService = new TokenService()
    const tokens = tokenService.generateTokenPair({
      id: existingUser.id,
      email,
    })

    // 기존 토큰이 존재하면 업데이트, 없으면 새로 생성
    const existingToken = await prisma.token.findFirst({
      where: { userId: existingUser.id },
    })

    const { access, refresh } = tokens

    if (existingToken) {
      // 기존 토큰 업데이트
      await prisma.token.update({
        where: { id: existingToken.id },
        data: {
          accessToken: access.token,
          refreshToken: refresh.token,
          expiresAt: new Date(refresh.expiresAt),
        },
      })
    } else {
      // 새 토큰 생성
      await prisma.token.create({
        data: {
          accessToken: access.token,
          refreshToken: refresh.token,
          userId: existingUser.id,
          expiresAt: new Date(refresh.expiresAt),
        },
      })
    }

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
