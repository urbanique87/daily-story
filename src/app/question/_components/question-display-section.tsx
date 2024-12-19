import { formatCustomDate } from "@/lib/dateFormatter"
import { useAnswerContext } from "../_context/answer-provider"

export function QuestionDisplaySection() {
  const { question } = useAnswerContext()

  return (
    <section
      role="region"
      aria-labelledby="question-section-title"
      data-testid="question-section"
    >
      <p className="mb-1 text-sm text-gray-400">
        {formatCustomDate(question.date)}
      </p>
      <p className="mb-1 text-base">
        오늘의 <span>{question.category}</span>
      </p>

      <h2 className="mb-7 text-2xl font-bold">{question.question}</h2>
    </section>
  )
}
