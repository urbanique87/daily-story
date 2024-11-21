import NextAuth, { AuthError } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
// lib
import { prisma } from "@/lib/prisma"
// config
import { nextAuthConfig } from "@/config/nextAuth.config"
// service
import { authenticateUser } from "@/services/user.service"
import { generateTokenPair } from "@/services/token.service"

class CustomError extends AuthError {
  constructor(code: string) {
    super()
    this.message = code
    this.stack = undefined
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...nextAuthConfig,
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

          const user = await authenticateUser({ email, password })
          if (!user.data) {
            throw new CustomError("INVALID_CREDENTIALS")
          }

          const tokens = await generateTokenPair({
            id: user.data.id,
            email,
          })

          if (!tokens.data) {
            throw new CustomError("FAIL_CREATE_TOKENS")
          }

          return {
            ...user.data,
            accessToken: tokens.data.access.token,
            accessTokenExpires: tokens.data.access.expires,
            refreshToken: tokens.data.refresh.token,
            refreshTokenExpires: tokens.data.refresh.expires,
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
