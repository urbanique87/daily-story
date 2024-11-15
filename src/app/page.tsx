import { Suspense } from "react"
// components
import QuestionHeader from "@/components/question/QuestionHeader"
import QuestionHeaderSkeleton from "@/components/question/QuestionHeader.skeleton"
import QuestionSection from "@/components/question/QuestionSection"
import AuthMenu from "@/components/auth/AuthMenu"
// lib
import { auth } from "@/lib/auth"
// types
import { Question } from "@/types/question.types"

export const dynamic = "force-dynamic"

export async function request<T>(
  url: string,
  options: RequestInit = {} // 기본값을 빈 객체로 설정
): Promise<T> {
  // 기본 옵션에 method와 headers 등을 포함할 수 있도록 설정
  const response = await fetch(url, options)

  // 응답 상태 코드가 200대가 아니면 에러 처리
  if (!response.ok) {
    throw new Error("Failed to fetch data")
  }

  // JSON 파싱 후 반환
  const data: T = await response.json()
  return data
}

export default async function Home() {
  const session = await auth()
  const accessToken = session?.accessToken

  const question = await request<Question>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/question`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (session) {
    return (
      <>
        <Suspense fallback={<QuestionHeaderSkeleton />}>
          <QuestionHeader session={session} />
        </Suspense>
        <div className="py-6">
          <QuestionSection question={question} />
        </div>
      </>
    )
  }

  return <AuthMenu />
}
