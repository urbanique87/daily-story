import bcrypt from "bcrypt"
// lib
import { prisma } from "@/lib/prisma"
// types
import type { User } from "@/types/user.types"
import type { Credentials } from "@/types/auth.types"
// utils
import { AppError } from "@/utils/errors/custom.error"
// constants
import { ErrorCodeMap } from "@/constants/error"

// ----------------------------------------------------------------------

/**
 * 사용자 자격 증명(이메일, 비밀번호)을 확인하고 해당 사용자를 반환한다.
 */
export async function validateUserCredentials({
  email,
  password,
}: Credentials): Promise<User> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new AppError(ErrorCodeMap.AUTH_USER_NOT_FOUND.code)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new AppError(ErrorCodeMap.AUTH_PASSWORD_MISMATCH.code)
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    }
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError(
          ErrorCodeMap.ERROR_UNKNOWN.code,
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."
        )
  }
}
