import { NextResponse } from "next/server"
// mocks
import { MOCK_USER } from "@/entities/user"

export async function GET() {
  return NextResponse.json(MOCK_USER)
}
