import { NextResponse } from "next/server"
// lib
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
// types
import { AppError, ErrorCode } from "@/types/error.types"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 401, "Authentication required")
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0) // 날짜만 비교할 수 있도록 시간 초기화

    // userAnswer DB에서 금일 기준 데이터 가져오기
    const existingAnswer = await prisma.answer.findFirst({
      where: {
        assignedAt: today,
      },
      include: {
        question: true,
      },
    })

    if (existingAnswer) {
      const data = {
        id: existingAnswer.id,
        date: existingAnswer.assignedAt,
        question: existingAnswer.question.question,
        category: existingAnswer.question.category,
      }

      // 금일 데이터가 이미 있는 경우
      return NextResponse.json({
        message: "Today's question already assigned.",
        data: data,
      })
    }

    // 중복되지 않은 Question ID 가져오기
    const answeredQuestionIds = await prisma.answer.findMany({
      select: {
        questionId: true,
      },
    })

    const excludedIds = answeredQuestionIds.map((item) => item.questionId)

    // Question DB에서 랜덤으로 질문 가져오기 (중복 제외)
    const randomQuestion = await prisma.question.findFirst({
      where: {
        id: {
          notIn: excludedIds, // 중복된 질문 제외
        },
      },
      orderBy: {
        // 랜덤으로 가져오기 위한 순서 설정 (SQLite 기반일 경우)
        id: "asc",
      },
    })

    if (!randomQuestion) {
      return NextResponse.json(
        { message: "No more questions available." },
        { status: 404 }
      )
    }

    // Answer DB에 새로운 데이터 삽입하기
    const newAnswer = await prisma.answer.create({
      data: {
        userId: session?.user.id as string,
        questionId: randomQuestion.id,
        assignedAt: today,
      },
    })

    const data = {
      id: newAnswer.id,
      date: newAnswer.assignedAt,
      question: randomQuestion.question,
      category: randomQuestion.category,
    }

    return NextResponse.json({
      message: "Question assigned successfully.",
      data: data,
    })
  } catch (error) {
    console.error("Error in GET:", error)
    return NextResponse.json({ message: "error" }, { status: 500 })
  }
}
