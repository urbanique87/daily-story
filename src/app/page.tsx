import { Suspense } from "react"
// components
import QuestionHeaderWithSuspense, {
  QuestionHeaderSkeleton,
} from "@/components/question/QuestionHeaderWithSuspense"
import QuestionSection from "@/components/question/QuestionSection"

export const dynamic = "force-dynamic"

export default async function Home() {
  return (
    <main>
      <Suspense fallback={<QuestionHeaderSkeleton />}>
        <QuestionHeaderWithSuspense />
      </Suspense>

      <div className="py-6">
        <QuestionSection />
      </div>
    </main>
  )
}
