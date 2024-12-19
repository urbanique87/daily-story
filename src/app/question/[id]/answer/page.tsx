// actions
import { getQuestionWithAnswerById } from "@/app/(main)/_actions/question-actions"
// components
import { AnswerPageHeader } from "../../_components/answer-page-header"
import { QuestionDisplaySection } from "../../_components/question-display-section"
import { AnswerTextarea } from "../../_components/answer-textarea"
// provider
import { AnswerProvider } from "../../_context/answer-provider"

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const question = await getQuestionWithAnswerById({ id: Number(id) })
  if (!question.success) {
    return <div>다시 시도 해줘</div>
  }

  return (
    <main className="max-w-[960px] px-4 mx-auto">
      <AnswerProvider question={question.data}>
        <AnswerPageHeader />
        <QuestionDisplaySection />
        <AnswerTextarea />
      </AnswerProvider>
    </main>
  )
}
