import { Suspense } from "react"
// components
import QuestionHeader from "@/components/question/QuestionHeader"
import QuestionHeaderSkeleton from "@/components/question/QuestionHeaderSkeleton"
import QuestionSection from "@/components/question/QuestionSection"
import AuthMenu from "@/components/auth/AuthMenu"

export const dynamic = "force-dynamic"

export default async function Home() {
  const isAuthorized = false

  return (
    <main>
      {isAuthorized ? (
        <>
          <Suspense fallback={<QuestionHeaderSkeleton />}>
            <QuestionHeader />
          </Suspense>
          <div className="py-6">
            <QuestionSection />
          </div>
        </>
      ) : (
        <AuthMenu />
      )}
    </main>
  )
}
