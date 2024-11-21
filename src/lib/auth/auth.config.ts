import type { NextAuthConfig } from "next-auth"
// constants
import { PATHS } from "@/constants/paths"
// services
import { refreshAccessToken } from "@/services/auth.service"

export const authConfig: NextAuthConfig = {
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
        token.accessTokenExpires = user.accessTokenExpires! * 1000
        token.refreshToken = user.refreshToken
        token.refreshTokenExpires = user.refreshTokenExpires! * 1000
      }

      // 액세스토큰이 만료되지 않았다면 리턴한다.
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // 액세스토큰이 만료되었다면, 리프레시토큰으로 재발급을 받는다.
      const refreshedToken = await refreshAccessToken({
        refreshToken: token.refreshToken as string,
      })

      if (!refreshedToken) {
        return {
          ...token,
          error: "RefreshToken expired",
        }
      }

      return {
        ...token,
        accessToken: refreshedToken.accessToken,
        accessTokenExpires: refreshedToken.accessTokenExpires * 1000,
        refreshToken: refreshedToken.refreshToken,
        refreshTokenExpires: refreshedToken.refreshTokenExpires * 1000,
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
