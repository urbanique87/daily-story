import { Suspense } from "react"
// components
import {
  QuestionHeader,
  QuestionHeaderSkeleton,
  QuestionSection,
} from "@/features/question"

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
