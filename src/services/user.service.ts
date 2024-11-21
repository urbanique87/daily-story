"use server"

import bcrypt from "bcrypt"
// lib
import { prisma } from "@/lib/prisma"
// types
import type { User } from "@/types/user.types"
import type { ApiResponse } from "@/types/response.types"
import { ErrorCode } from "@/types/error.types"

// ----------------------------------------------------------------------

/**
 * 사용자 인증 후 정보 조회
 */
export async function authenticateUser({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<ApiResponse<User>> {
  try {
    // 이메일로 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        success: false,
        message: "일치하는 사용자가 없습니다.",
        data: null,
        error: ErrorCode.UNAUTHORIZED,
      }
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return {
        success: false,
        message: "비밀번호가 올바르지 않습니다.",
        data: null,
        error: ErrorCode.WRONG_PASSWORD,
      }
    }

    return {
      success: true,
      message: "사용자의 정보가 올바릅니다.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    }
  } catch (error) {
    console.error("사용자 인증 중 오류 발생:", error)
    return {
      success: false,
      message: "사용자 정보를 불러오는 중 오류가 발생했습니다.",
      data: null,
      error: ErrorCode.INTERNAL_SERVER_ERROR,
    }
  }
}
