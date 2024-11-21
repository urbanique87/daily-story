import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
// lib
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
// types
import type { Question } from "@/types/question.types"
import type { ApiResponse } from "@/types/response.types"
import { ErrorCode } from "@/types/error.types"

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
export async function getTodayQuestion(): Promise<ApiResponse<Question>> {
  try {
    // 사용자 세션 인증
    const session = await auth()
    if (!session?.user) {
      return {
        success: false,
        message: "사용자 세션이 만료되었습니다.",
        data: null,
        error: ErrorCode.UNAUTHORIZED,
      }
    }

    // 오늘 날짜 범위 설정
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    // 오늘 사용자에게 지급된 질문 조회
    const question = await prisma.userQuestion.findFirst({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
      select: {
        id: true, // 지급 받은 질문 아이디
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
      return {
        success: false,
        message: "오늘 지급받은 질문이 없습니다.",
        data: null,
        error: ErrorCode.NO_QUESTION_TODAY,
      }
    }

    // 질문 데이터 반환
    return {
      success: true,
      message: "오늘의 질문을 성공적으로 불러왔습니다.",
      data: {
        id: question.id,
        date: question.createdAt.toDateString(),
        category: question.questionTemplate.category.name,
        question: question.questionTemplate.text,
        answer: question.userAnswer?.text || null,
      },
    }
  } catch (error) {
    console.error("오늘의 질문을 불러오는 중 오류 발생:", error)
    return {
      success: false,
      message: "질문을 불러오는 중 오류가 발생했습니다.",
      data: null,
      error: ErrorCode.INTERNAL_SERVER_ERROR,
    }
  }
}

// ----------------------------------------------------------------------

/**
 * 새로운 질문 생성
 */
export async function createTodayQuestion(): Promise<ApiResponse<Question>> {
  try {
    // 사용자 세션 인증
    const session = await auth()
    if (!session?.user) {
      return {
        success: false,
        message: "사용자 세션이 만료되었습니다.",
        data: null,
        error: ErrorCode.UNAUTHORIZED,
      }
    }

    // 사용자에게 할당되지 않은 새 질문 찾기
    const newQuestion = await findUnusedQuestion(session.user.id)

    if (!newQuestion) {
      return {
        success: false,
        message: "모든 질문을 이미 받으셨습니다.",
        data: null,
        error: ErrorCode.ALL_QUESTIONS_DISTRIBUTED,
      }
    }

    // 트랜잭션을 통해 새 질문 생성
    const result = await prisma.$transaction(
      async (tx) => {
        return await tx.userQuestion.create({
          data: {
            userId: session.user.id,
            questionId: newQuestion.id,
          },
          select: {
            id: true,
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
      success: true,
      message: "새로운 질문을 성공적으로 생성했습니다.",
      data: {
        id: result.id,
        date: result.createdAt.toDateString(),
        category: result.questionTemplate.category.name,
        question: result.questionTemplate.text,
        answer: null,
      },
    }
  } catch (error) {
    console.error("질문 생성 중 오류 발생:", error)

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "이미 질문을 받았습니다.",
          data: null,
          error: ErrorCode.DUPLICATE_QUESTION,
        }
      }
    }

    // 알 수 없는 서버 오류
    return {
      success: false,
      message: "질문 생성 중 오류가 발생했습니다.",
      data: null,
      error: ErrorCode.INTERNAL_SERVER_ERROR,
    }
  }
}
