import NextAuth, { NextAuthRequest } from "next-auth"
import { NextResponse } from "next/server"
// config
import { authConfig } from "@/lib/auth/auth.config"
// constants
import { PATHS } from "@/constants/paths"

const { auth, signOut } = NextAuth(authConfig)

// 로그인 페이지로 리다이렉트하는 함수
function redirectToLoginPage(request: NextAuthRequest, callbackUrl: string) {
  const redirectUrl = new URL(
    `${PATHS.SIGNIN}?callbackUrl=${callbackUrl}`,
    request.url
  )
  return NextResponse.redirect(redirectUrl)
}

// 주어진 callbackUrl로 리다이렉트하는 함수
function redirectToTargetUrl(request: NextAuthRequest, targetUrl: string) {
  const redirectUrl = new URL(targetUrl, request.url)
  return NextResponse.redirect(redirectUrl)
}

// 토큰 만료 처리 및 세션 상태 체크 후 리다이렉션 함수
async function handleTokenExpirationAndRedirect(
  request: NextAuthRequest,
  currentPath: string
) {
  // 로그아웃 처리
  await signOut({ redirect: false })

  // 로그인 페이지로 리다이렉트
  return redirectToLoginPage(request, encodeURIComponent(currentPath))
}

// 세션 상태 확인 및 로그인 페이지 리다이렉션 처리
function handleUnauthenticatedUser(
  request: NextAuthRequest,
  currentPath: string
) {
  const callbackUrl = encodeURIComponent(currentPath)
  return redirectToLoginPage(request, callbackUrl)
}

// 로그인 후 callbackUrl로 리다이렉트 처리
async function handleAuthenticatedUserRedirect(request: NextAuthRequest) {
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl")
  if (callbackUrl) {
    return redirectToTargetUrl(request, callbackUrl)
  }

  // callbackUrl이 없으면 기본 페이지로 계속 진행
  return NextResponse.next()
}

export default auth(async function middleware(request: NextAuthRequest) {
  const unprotectedPaths = [PATHS.MAIN, PATHS.SIGNIN, PATHS.SIGNUP]
  const isAuthenticated = request.auth
  const currentPath = request.nextUrl.pathname

  // 로그인되지 않은 사용자 리다이렉트
  if (!isAuthenticated && !unprotectedPaths.includes(currentPath)) {
    return handleUnauthenticatedUser(request, currentPath)
  }

  // 토큰 만료 에러 처리
  if (request.auth?.error === "RefreshToken expired") {
    return handleTokenExpirationAndRedirect(request, currentPath)
  }

  // 인증된 사용자는 callbackUrl에 따라 리다이렉트 처리
  if (isAuthenticated) {
    return handleAuthenticatedUserRedirect(request)
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
