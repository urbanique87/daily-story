import {
  AnswerProvider,
  AnswerHeader,
  QuestionDisplay,
  AnswerTextarea,
} from "@/components/answer"
// actions
import { getQuestionWithAnswerById } from "@/actions/question.actions"

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
        <AnswerHeader />
        <QuestionDisplay />
        <AnswerTextarea />
      </AnswerProvider>
    </main>
  )
}
