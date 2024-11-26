"use server"

import { revalidatePath } from "next/cache"
// lib
import { auth } from "@/lib/auth"
// services
import { createUserAnswer } from "@/services/answer.service"
// utils
import { AppError } from "@/utils/errors/custom.error"
import { handleActionError } from "@/utils/errors/action-error-handler"
// constants
import { ErrorCodeMap } from "@/constants/error"

// ----------------------------------------------------------------------

interface Answer {
  questionId: number
  answerText: string
}

// ----------------------------------------------------------------------

/**
 * 답변 저장하기
 */
export async function saveAnswer({ questionId, answerText }: Answer) {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new AppError(ErrorCodeMap.AUTH_UNAUTHORIZED.code)
    }

    const result = await createUserAnswer({
      userId: session.user.id,
      questionId,
      answerText,
    })

    revalidatePath(`/question/${questionId}/answer`)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return handleActionError(error)
  }
}
