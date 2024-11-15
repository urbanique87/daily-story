import { NextResponse } from "next/server"
// mocks
import jwt, { type JwtPayload } from "jsonwebtoken"
import { PrismaClient, User } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  request: Request
): Promise<NextResponse<User | { message: string }>> {
  try {
    const Authorization = request.headers.get("Authorization")
    if (!Authorization) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      )
    }

    // Bearer token 추출
    const token = Authorization.split(" ")[1]

    // JWT 검증
    const decoded = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!
    ) as JwtPayload

    // JWT에서 사용자 ID 추출
    const userId = decoded.id

    // Prisma를 통해 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    // 사용자 정보가 없으면 404 반환
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // 사용자 정보를 반환
    return NextResponse.json(user)
  } catch (error) {
    // JWT 검증 실패 또는 다른 에러 처리
    console.error(error)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}
