"use server"

import { AuthError } from "next-auth"
import { revalidatePath } from "next/cache"
// lib
import { signIn } from "@/lib/auth"
import { PATHS } from "@/constants/paths"

interface SignininProps {
  email: string
  password: string
}

export async function signin({ email, password }: SignininProps) {
  try {
    if (!email || !password) {
      return {
        success: false,
        errorCode: "INVALID_INPUT",
        message: "이메일과 비밀번호를 모두 입력해주세요.",
      }
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    // 페이지 데이터 갱신
    revalidatePath(PATHS.SIGNIN)

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.message) {
        case "INVALID_CREDENTIALS":
          return {
            success: false,
            errorCode: "INVALID_CREDENTIALS",
            message: "이메일 또는 비밀번호가 올바르지 않습니다.",
          }
        default:
          return {
            success: false,
            errorCode: "AUTH_ERROR",
            message: "로그인에 문제가 발생했습니다. 다시 시도해주세요.",
          }
      }
    }

    return {
      success: false,
      errorCode: "SERVER_ERROR",
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    }
  }
}
