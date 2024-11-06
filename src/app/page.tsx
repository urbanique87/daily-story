import { Suspense } from "react"
// components
import QuestionSection from "@/components/question/QuestionSection"
import QuestionHeader, { QuestionHeaderSkeleton } from "@/components/question/QuestionHeader"

export const dynamic = "force-dynamic"

export default async function Home() {
  return (
    <main>
      <Suspense fallback={<QuestionHeaderSkeleton />}>
        <QuestionHeader />
      </Suspense>

      <div className="py-6">
        <QuestionSection />
      </div>
    </main>
  )
}
