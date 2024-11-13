import NextAuth from "next-auth"
import { AuthError } from "next-auth"
import Credentials from "next-auth/providers/credentials"
// utils
import { getUserFromDb } from "@/lib/db"
import { authConfig } from "@/lib/auth/auth.config"

class CustomError extends AuthError {
  constructor(code: string) {
    super()
    this.message = code
    this.stack = undefined
  }
}

interface TokensResponse {
  accessToken: string
  accessTokenExpires: number
  refreshToken: string
  refreshTokenExpires: number
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const email = credentials?.email as string
          const password = credentials?.password as string

          const user = await getUserFromDb(email, password)

          if (!user) {
            throw new CustomError("INVALID_CREDENTIALS")
          }

          // 액세스 토큰, 리프레시 토큰 발급
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/tokens`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: user.id,
                email,
              }),
            }
          )

          const result = await response.json()
          const tokens: TokensResponse = result.data

          return {
            ...user,
            accessToken: tokens.accessToken,
            accessTokenExpires: tokens.accessTokenExpires,
            refreshToken: tokens.refreshToken,
            refreshTokenExpires: tokens.refreshTokenExpires,
          }
        } catch (error) {
          if (error instanceof AuthError) {
            throw new CustomError(error.message)
          }

          throw new CustomError("An unknown error occurred.")
        }
      },
    }),
  ],
})
