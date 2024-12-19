"use server"

import { revalidatePath } from "next/cache"
import { hash } from "bcrypt"
// lib
import { prisma } from "@/lib/prisma"
import { signIn } from "@/lib/auth"
// constants
import { PATHS } from "@/constants/paths"
// utils
import { AppError } from "@/utils/errors/custom.error"
import { handleActionError } from "@/utils/errors/action-error-handler"
import { ApiResponse } from "@/types/response.types"
import { ErrorCodeMap } from "@/constants/error"

export async function signup(formData: FormData): Promise<ApiResponse<null>> {
  try {
    // formData에서 이메일, 비밀번호 추출
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
      throw new AppError(ErrorCodeMap.VALIDATION_REQUIRED_FIELD_MISSING.code)
    }

    // 타입 검사
    if (typeof email !== "string" || typeof password !== "string") {
      throw new AppError(ErrorCodeMap.VALIDATION_FORMAT_ERROR.code)
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new AppError(ErrorCodeMap.AUTH_DUPLICATE_USER.code)
    }

    // 비밀번호 해시화
    const hashedPassword = await hash(password, 10)

    // 사용자 생성
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    // 회원가입 성공 후 자동 로그인
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    // 페이지 데이터 갱신
    revalidatePath(PATHS.SIGNUP)

    return { success: true, data: null }
  } catch (error) {
    return handleActionError(error)
  }
}
