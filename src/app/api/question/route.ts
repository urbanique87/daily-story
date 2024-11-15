import { NextResponse } from "next/server"

export async function GET() {
  const MOCK_QUESTION_DATA = {
    id: 1,
    date: "2024-11-04",
    category: "일상",
    question: "오늘, 가장 엉뚱했던 순간은 뭐였어?",
  }

  return NextResponse.json(MOCK_QUESTION_DATA)
}
