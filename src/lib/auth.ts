import NextAuth, { AuthError } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
// lib
import { prisma } from "@/lib/prisma"
// config
import { nextAuthConfig } from "@/config/nextAuth-config"
// actions
import { loginUser } from "@/actions/auth-actions"
import { generateToken } from "@/actions/token-actions"
// types
import { TokenPayload, Tokens } from "@/types/token.types"
// constants
import { ErrorCodeMap } from "@/constants/error"

// ----------------------------------------------------------------------

export interface AuthenticatedUser
  extends Tokens,
    Pick<TokenPayload, "id" | "email"> {
  [key: string]: unknown
}

// ----------------------------------------------------------------------

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...nextAuthConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials): Promise<AuthenticatedUser | null> {
        try {
          const email = credentials?.email as string
          const password = credentials?.password as string

          const userResult = await loginUser({ email, password })
          if (!userResult.success) {
            throw new AuthError("Authentication failed", {
              cause: {
                type: ErrorCodeMap.TOKEN_INVALID.code,
                message: "이메일 또는 비밀번호가 올바르지 않습니다.",
              },
            })
          }

          const tokensResult = await generateToken({
            id: userResult.data.id,
            email,
          })

          if (!tokensResult.success) {
            throw new AuthError("Token generation failed", {
              cause: {
                type: ErrorCodeMap.TOKEN_GENERATION_FAILED.code,
                message: "토큰 생성에 실패했습니다. 다시 시도해주세요.",
              },
            })
          }

          return {
            ...userResult.data,
            ...tokensResult.data,
          }
        } catch (error) {
          throw error
        }
      },
    }),
  ],
})
