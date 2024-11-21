"use server"

import {
  createTodayQuestion,
  getTodayQuestion,
} from "@/services/question.service"

// ----------------------------------------------------------------------

/**
 * 오늘의 질문 조회 - 없으면 새로운 질문 생성
 */
export async function getOrCreateTodayQuestion() {
  const todayQuestionResponse = await getTodayQuestion()
  if (todayQuestionResponse.success) {
    return todayQuestionResponse.data
  }

  const newQuestionResponse = await createTodayQuestion()
  if (newQuestionResponse.success) {
    return newQuestionResponse.data
  }

  return null
}
