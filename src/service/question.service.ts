import { cookies } from "next/headers"
// lib
import { auth } from "@/lib/auth"
import { request } from "@/lib/request"
// types
import type { Question } from "@/types/question.types"
import { AppError, ErrorCode } from "@/types/error.types"

export async function fetchQuestion(): Promise<Question> {
  const session = await auth()
  if (!session?.user) {
    throw new AppError(ErrorCode.UNAUTHORIZED, 401, "Authentication required")
  }

  const cookieStore = await cookies()

  return await request<Question>("/api/question", {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
    credentials: "include",
  })
}
