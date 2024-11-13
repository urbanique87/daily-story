import { Suspense } from "react"
// components
import QuestionHeader from "@/components/question/QuestionHeader"
import QuestionHeaderSkeleton from "@/components/question/QuestionHeader.skeleton"
import QuestionSection from "@/components/question/QuestionSection"
import AuthMenu from "@/components/auth/AuthMenu"
// lib
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function Home() {
  const session = await auth()

  if (session) {
    return (
      <>
        <Suspense fallback={<QuestionHeaderSkeleton />}>
          <QuestionHeader session={session} />
        </Suspense>
        <div className="py-6">
          <QuestionSection />
        </div>
      </>
    )
  }

  return <AuthMenu />
}
