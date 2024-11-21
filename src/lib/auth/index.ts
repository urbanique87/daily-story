import NextAuth from "next-auth"
import { AuthError } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
// service
import { fetchTokens } from "@/services/token.service"
// lib
import { prisma } from "@/lib/prisma"
import { getUserFromDb } from "@/lib/db"
// config
import { authConfig } from "@/lib/auth/auth.config"

class CustomError extends AuthError {
  constructor(code: string) {
    super()
    this.message = code
    this.stack = undefined
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
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

          const response = await fetchTokens({
            userId: user.id,
            email,
          })

          return {
            ...user,
            accessToken: response.accessToken,
            accessTokenExpires: response.accessTokenExpires,
            refreshToken: response.refreshToken,
            refreshTokenExpires: response.refreshTokenExpires,
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
