// components
import QuestionHeader from "@/components/question/QuestionHeader"
import QuestionSection from "@/components/question/QuestionSection"
import AuthMenu from "@/components/auth/AuthMenu"
// lib
import { auth } from "@/lib/auth"
// api
import { fetchQuestion } from "@/service/question.service"

export const dynamic = "force-dynamic"

export default async function MainPage() {
  const session = await auth()
  if (!session?.user) {
    return <AuthMenu />
  }

  const question = await fetchQuestion()
  return (
    <main className="max-w-[960px] px-4 mx-auto">
      <QuestionHeader session={session} />
      <div className="py-6">
        <QuestionSection question={question} />
      </div>
    </main>
  )
}
