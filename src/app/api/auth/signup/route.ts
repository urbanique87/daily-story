import { NextResponse } from "next/server"
import { hash } from "bcrypt"
// services
import { TokenService } from "@/service/token.service"

interface UserCredentials {
  email: string
  password: string
}

export async function POST(request: Request) {
  try {
    const credentials: UserCredentials = await request.json()
    const { email, password } = credentials

    // TODO: 이메일 중복 확인

    // TODO 사용자 저장 로직 (DB)
    const hashedPassword = await hash(password, 10) // 비밀번호 해싱
    const user = { email, password: hashedPassword }
    const TEST_USER_ID = 0

    const tokenService = new TokenService()
    const tokens = tokenService.generateTokenPair({
      id: TEST_USER_ID,
      email,
    })

    return NextResponse.json({
      message: "success",
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
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
