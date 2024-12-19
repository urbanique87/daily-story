import AuthMenu from "@/app/(main)/_components/auth-menu"
// lib
import { auth } from "@/lib/auth"
// actions
import { getOrCreateTodayQuestion } from "@/app/(main)/_actions/question-actions"
// components
import QuestionHeader from "./_components/question-header"
import QuestionSection from "./_components/question-section"
import QuestionSectionFallback from "./_components/question-section-fallback"

export const dynamic = "force-dynamic"

export default async function MainPage() {
  const session = await auth()
  if (!session?.user) {
    return (
      <main className="max-w-[960px] px-4 mx-auto">
        <AuthMenu />
      </main>
    )
  }

  const question = await getOrCreateTodayQuestion()

  return (
    <main className="max-w-[960px] px-4 mx-auto">
      <QuestionHeader session={session} />

      <div className="py-6">
        {question.success ? (
          <QuestionSection question={question.data} />
        ) : (
          <QuestionSectionFallback />
        )}
      </div>
    </main>
  )
}
