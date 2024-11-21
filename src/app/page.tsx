// components
import QuestionHeader from "@/components/question/QuestionHeader"
import QuestionSection from "@/components/question/QuestionSection"
import QuestionSectionFallback from "@/components/question/QuestionSection.fallback"
import AuthMenu from "@/components/auth/AuthMenu"
// lib
import { auth } from "@/lib/auth"
// api
import { getOrCreateTodayQuestion } from "@/services/question.service"

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
        {question ? (
          <QuestionSection question={question} />
        ) : (
          <QuestionSectionFallback />
        )}
      </div>
    </main>
  )
}
