"use server"

import { ErrorCodeMap } from "@/constants/error"
// lib
import { auth } from "@/lib/auth"
// services
import {
  createTodayQuestion,
  getQuestionById,
  getTodayQuestion,
} from "@/app/(main)/_services/question-service"
// types
import { Question } from "@/types/question.types"
import { ApiResponse } from "@/types/response.types"
// utils
import { handleActionError } from "@/utils/errors/action-error-handler"
import { AppError } from "@/utils/errors/custom.error"

// ----------------------------------------------------------------------

/**
 * 오늘의 질문 조회 - 없으면 새로운 질문 생성
 */
export async function getOrCreateTodayQuestion(): Promise<
  ApiResponse<Question>
> {
  try {
    // 사용자 세션 인증
    const session = await auth()
    if (!session?.user) {
      throw new AppError(ErrorCodeMap.SESSION_EXPIRED.code)
    }

    const userId = session.user.id

    try {
      const existingQuestion = await getTodayQuestion({ userId })
      return {
        success: true,
        data: existingQuestion,
      }
    } catch (error) {
      if (
        error instanceof AppError &&
        error.code === ErrorCodeMap.QUESTION_NOT_FOUND.code
      ) {
        try {
          const newQuestion = await createTodayQuestion({ userId })
          return {
            success: true,
            data: newQuestion,
          }
        } catch (error) {
          throw error
        }
      } else {
        throw error
      }
    }
  } catch (error) {
    return handleActionError(error)
  }
}

// ----------------------------------------------------------------------

/**
 * 아이디 기준으로 질문과 답변 가져오기
 */
export async function getQuestionWithAnswerById({
  id,
}: {
  id: number
}): Promise<ApiResponse<Question>> {
  try {
    // 사용자 세션 인증
    const session = await auth()
    if (!session?.user) {
      throw new AppError(ErrorCodeMap.SESSION_EXPIRED.code)
    }

    const userId = session.user.id
    const question = await getQuestionById({ userId, id })

    return {
      success: true,
      data: question,
    }
  } catch (error) {
    return handleActionError(error)
  }
}
