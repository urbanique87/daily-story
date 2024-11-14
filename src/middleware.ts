import NextAuth from "next-auth"
import { authConfig } from "./lib/auth/auth.config"
import { NextRequest, NextResponse } from "next/server"
import { PATHS } from "./constants/paths"

const { auth, signOut } = NextAuth(authConfig)

export async function middleware(request: NextRequest) {
  const session = await auth()
  if (session?.error === "RefreshToken expired") {
    // 로그아웃 처리
    await signOut({
      redirect: false,
    })

    // 현재 요청 URL
    const requestUrl = new URL(request.nextUrl.pathname, request.url)
    // 현재 페이지 URL을 저장
    const callbackUrl = encodeURIComponent(requestUrl.pathname)

    // 3. 로그인 페이지로 리다이렉트
    return NextResponse.redirect(
      new URL(`${PATHS.SIGNIN}?callbackUrl=${callbackUrl}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|signin|signup).*)",
  ],
}
