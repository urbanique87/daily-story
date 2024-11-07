import { NextResponse } from "next/server"
// mocks
import { MOCK_QUESTION_DATA } from "@/entities/question"

export async function GET() {
  return NextResponse.json(MOCK_QUESTION_DATA)
}
