"use server"

import { revalidatePath } from "next/cache"
import { hash } from "bcrypt"
// lib
import { prisma } from "@/lib/prisma"
import { signIn } from "@/lib/auth"
// constants
import { PATHS } from "@/constants/paths"

export async function signup(formData: FormData) {
  try {
    // formData에서 이메일, 비밀번호 추출
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
      return {
        success: false,
        errorCode: "MISSING_FIELDS",
        message: "이메일과 비밀번호는 필수입니다.",
      }
    }

    // 타입 검사
    if (typeof email !== "string" || typeof password !== "string") {
      return {
        success: false,
        errorCode: "INVALID_FORMAT",
        message: "잘못된 입력 형식입니다.",
      }
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        errorCode: "USER_EXISTS",
        message: "User already exists",
      }
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

    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)

    return {
      success: false,
      errorCode: "SERVER_ERROR",
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    }
  }
}
