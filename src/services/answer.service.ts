import { PrismaClient, Prisma } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"
// lib
import { prisma } from "@/lib/prisma"
// utils
import { AppError } from "@/utils/errors/custom.error"
// constants
import { ErrorCodeMap } from "@/constants/error"

// ----------------------------------------------------------------------

interface Answer {
  userId: string
  questionId: number
  answerText: string
}

// ----------------------------------------------------------------------

/**
 * 인증/권한 검증 로직
 */
async function validateQuestionAccess(
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  userId: string,
  questionId: number
) {
  const existingQuestion = await tx.userQuestion.findUnique({
    where: {
      userId_questionId_unique: { userId, questionId },
    },
  })

  if (!existingQuestion) {
    throw new AppError(ErrorCodeMap.QUESTION_NOT_FOUND.code)
  }
}

// ----------------------------------------------------------------------

/**
 * 답변 생성 로직
 */
async function createAnswer(
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  userId: string,
  questionId: number,
  answerText: string
) {
  return tx.userAnswer.upsert({
    where: {
      userId_questionId_unique: {
        userId,
        questionId,
      },
    },
    create: {
      userId,
      questionId,
      text: answerText,
    },
    update: {
      text: answerText,
    },
  })
}

// ----------------------------------------------------------------------

/**
 * 질문 업데이트 로직
 */
async function updateQuestion(
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  userId: string,
  questionId: number,
  answerId: number
) {
  return tx.userQuestion.update({
    where: {
      userId_questionId_unique: { userId, questionId },
    },
    data: { answerId },
  })
}

// ----------------------------------------------------------------------

/**
 * 답변 저장 및 질문과 연결
 */
export async function createUserAnswer({
  userId,
  questionId,
  answerText,
}: Answer) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 접근 권한 검증
      await validateQuestionAccess(tx, userId, questionId)

      const answer = await createAnswer(tx, userId, questionId, answerText)

      await updateQuestion(tx, userId, questionId, answer.id)

      return null
    })

    return result
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
