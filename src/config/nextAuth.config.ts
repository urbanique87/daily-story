import type { NextAuthConfig } from "next-auth"
// constants
import { PATHS } from "@/constants/paths"
// services
import { refreshAccessToken } from "@/services/token.service"

const TOKEN_MULTIPLIER = 1000 // 초를 밀리초로 변환

export const nextAuthConfig: NextAuthConfig = {
  pages: {
    signIn: PATHS.SIGNIN,
    signOut: PATHS.SIGNOUT,
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.accessToken = user.accessToken
        token.accessTokenExpires = user.accessTokenExpires! * TOKEN_MULTIPLIER
        token.refreshToken = user.refreshToken
        token.refreshTokenExpires = user.refreshTokenExpires! * TOKEN_MULTIPLIER
      }

      // 액세스 토큰이 만료되지 않았다면 기존 토큰 반환
      const currentTime = Date.now()
      const accessTokenExpires = token.accessTokenExpires as number
      if (currentTime < accessTokenExpires) {
        return token
      }

      // 액세스토큰이 만료되었다면, 리프레시토큰으로 재발급을 받는다.
      const refreshedToken = await refreshAccessToken({
        refreshToken: token.refreshToken as string,
      })

      if (!refreshedToken.data) {
        return {
          ...token,
          error: "RefreshToken expired",
        }
      }

      return {
        ...token,
        accessToken: refreshedToken.data.access.token,
        accessTokenExpires:
          refreshedToken.data.access.expires * TOKEN_MULTIPLIER,
        refreshToken: refreshedToken.data.refresh.token,
        refreshTokenExpires:
          refreshedToken.data.refresh.expires * TOKEN_MULTIPLIER,
      }
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.image as string
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
      }

      // 에러가 있는 경우에만 포함
      if (token.error) {
        session.error = token.error as string
      }

      return session
    },
  },
}
