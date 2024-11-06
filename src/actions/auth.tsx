"use server"

import { hash } from "bcrypt"
import { revalidatePath } from "next/cache"

export async function signup(formData: FormData) {
  try {
    // formData에서 이메일, 비밀번호 추출
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
      throw new Error("이메일과 비밀번호는 필수입니다.")
    }

    // 타입 검사
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("잘못된 입력 형식입니다.")
    }

    // 이메일 중복 확인

    // 비밀번호 해싱
    const hashedPassword = await hash(password, 10)

    // DB 저장 로직

    // 페이지 데이터 갱신
    revalidatePath("/signup")

    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}
