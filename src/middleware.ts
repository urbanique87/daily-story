import NextAuth, { NextAuthRequest } from "next-auth"
import { NextResponse } from "next/server"
// config
import { nextAuthConfig } from "@/config/nextAuth-config"
// constants
import { PATHS } from "@/constants/paths"

// ----------------------------------------------------------------------

const { auth, signOut } = NextAuth(nextAuthConfig)

// ----------------------------------------------------------------------

// 리다이렉트 URL 생성 함수
function createRedirectUrl(request: NextAuthRequest, targetUrl: string) {
  return new URL(targetUrl, request.url)
}

// 로그인 페이지로 리다이렉트하는 함수
function redirectToLoginPage(request: NextAuthRequest, callbackUrl: string) {
  const loginUrl = createRedirectUrl(
    request,
    `${PATHS.SIGNIN}?callbackUrl=${callbackUrl}`
  )
  return NextResponse.redirect(loginUrl)
}

// 인증되지 않은 사용자의 처리
function handleUnauthenticated(request: NextAuthRequest, currentPath: string) {
  return redirectToLoginPage(request, encodeURIComponent(currentPath))
}

// 토큰 만료 처리 및 로그아웃
async function handleTokenExpiration(
  request: NextAuthRequest,
  currentPath: string
) {
  await signOut({ redirect: false }) // 로그아웃 처리
  return redirectToLoginPage(request, encodeURIComponent(currentPath))
}

// 인증된 사용자의 리다이렉트 처리
function handleAuthenticatedRedirect(request: NextAuthRequest) {
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl")
  return callbackUrl
    ? NextResponse.redirect(createRedirectUrl(request, callbackUrl)) // callbackUrl이 있으면 리다이렉트
    : NextResponse.next() // 없으면 기본 흐름
}

// ----------------------------------------------------------------------

export default auth(async function middleware(request: NextAuthRequest) {
  const unprotectedPaths = [PATHS.MAIN, PATHS.SIGNIN, PATHS.SIGNUP]
  const authenticated = request.auth
  const currentUrlPath = request.nextUrl.pathname

  // 로그인되지 않은 사용자가 보호된 경로에 접근 시 리다이렉트
  if (!authenticated && !unprotectedPaths.includes(currentUrlPath)) {
    return handleUnauthenticated(request, currentUrlPath)
  }

  // 토큰 만료 처리
  if (request.auth?.error === "RefreshToken expired") {
    return handleTokenExpiration(request, currentUrlPath)
  }

  // 인증된 사용자는 로그인 및 회원가입 페이지에 접근할 수 없음
  const restrictedPaths = [PATHS.SIGNIN, PATHS.SIGNUP]
  if (authenticated && restrictedPaths.includes(currentUrlPath)) {
    return NextResponse.redirect(createRedirectUrl(request, PATHS.MAIN))
  }

  // 인증된 사용자는 callbackUrl에 따라 리다이렉트 처리
  if (authenticated) {
    return handleAuthenticatedRedirect(request)
  }

  // 기본 흐름을 따를 경우
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
