import { NextResponse } from "next/server"
// mocks
import { MOCK_USER } from "@/mocks/user"

export async function GET() {
  return NextResponse.json(MOCK_USER)
}
