// lib
import { prisma } from "@/lib/prisma"
// types
import type { Question } from "@/types/question.types"
// utils
import { AppError } from "@/utils/errors/custom.error"
import { ErrorCodeMap } from "@/constants/error"

// ----------------------------------------------------------------------

/**
 * 사용자에게 아직 지급되지 않은 질문 찾기
 */
async function findUnusedQuestion(userId: string) {
  // 사용자가 이미 받은 질문 ID 조회
  const receivedQuestionIds = await prisma.userQuestion.findMany({
    where: { userId },
    select: { questionId: true },
  })

  // 받지 않은 질문 중 가장 첫 번째 질문 반환
  return prisma.questionTemplate.findFirst({
    where: {
      id: { notIn: receivedQuestionIds.map((q) => q.questionId) },
    },
    orderBy: { id: "asc" },
  })
}

// ----------------------------------------------------------------------

/**
 * 오늘의 질문 조회
 */
export async function getTodayQuestion({
  userId,
}: {
  userId: string
}): Promise<Question> {
  try {
    // 오늘 날짜 범위 설정
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    // 오늘 사용자에게 지급된 질문 조회
    const question = await prisma.userQuestion.findFirst({
      where: {
        userId,
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
      select: {
        questionId: true, // 지급 받은 질문 아이디
        createdAt: true, // 지급 받은 날짜
        userAnswer: { select: { text: true } }, // 지급 받은 질문의 답변
        questionTemplate: {
          select: {
            text: true, // 지급 받은 질문의 내용
            category: { select: { name: true } }, // 지급 받은 질문의 카테고리
          },
        },
      },
    })

    // 오늘의 질문이 없는 경우
    if (!question) {
      throw new AppError(ErrorCodeMap.QUESTION_NOT_FOUND.code)
    }

    // 질문 데이터 반환
    return {
      id: question.questionId,
      date: question.createdAt.toDateString(),
      category: question.questionTemplate.category.name,
      question: question.questionTemplate.text,
      answer: question.userAnswer?.text || null,
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

// ----------------------------------------------------------------------

/**
 * 아이디 기준 질문 조회
 */
export async function getQuestionById({
  userId,
  id,
}: {
  userId: string
  id: number
}): Promise<Question> {
  try {
    // 오늘 날짜 범위 설정
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    // 오늘 사용자에게 지급된 질문 조회
    const question = await prisma.userQuestion.findFirst({
      where: {
        userId: userId,
        questionId: id,
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
      select: {
        questionId: true, // 지급 받은 질문 아이디
        createdAt: true, // 지급 받은 날짜
        userAnswer: { select: { text: true } }, // 지급 받은 질문의 답변
        questionTemplate: {
          select: {
            text: true, // 지급 받은 질문의 내용
            category: { select: { name: true } }, // 지급 받은 질문의 카테고리
          },
        },
      },
    })

    // 오늘의 질문이 없는 경우
    if (!question) {
      throw new AppError(ErrorCodeMap.QUESTION_NOT_FOUND.code)
    }

    // 질문 데이터 반환
    return {
      id: question.questionId,
      date: question.createdAt.toDateString(),
      category: question.questionTemplate.category.name,
      question: question.questionTemplate.text,
      answer: question.userAnswer?.text || null,
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

// ----------------------------------------------------------------------

/**
 * 새로운 질문 생성
 */
export async function createTodayQuestion({
  userId,
}: {
  userId: string
}): Promise<Question> {
  try {
    // 사용자에게 할당되지 않은 새 질문 찾기
    const newQuestion = await findUnusedQuestion(userId)
    if (!newQuestion) {
      throw new AppError(ErrorCodeMap.QUESTION_NOT_AVAILABLE.code)
    }

    // 트랜잭션을 통해 새 질문 생성
    const result = await prisma.$transaction(
      (tx) => {
        return tx.userQuestion.create({
          data: {
            userId,
            questionId: newQuestion.id,
          },
          select: {
            questionId: true,
            createdAt: true,
            userAnswer: { select: { text: true } },
            questionTemplate: {
              select: {
                text: true,
                category: { select: { name: true } },
              },
            },
          },
        })
      },
      {
        maxWait: 5000, // 최대 대기 시간 5초
        timeout: 10000, // 최대 처리 시간 10초
      }
    )

    // 새 질문 데이터 반환
    return {
      id: result.questionId,
      date: result.createdAt.toDateString(),
      category: result.questionTemplate.category.name,
      question: result.questionTemplate.text,
      answer: null,
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
