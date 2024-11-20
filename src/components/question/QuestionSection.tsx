import Link from "next/link"
// libs
import { formatCustomDate } from "@/lib/dateFormatter"
// constants
import { PATHS } from "@/constants/paths"
// types
import { Question } from "@/types/question.types"

/**
 * 질문 컴포넌트
 */
export default function QuestionSection({ question }: { question: Question }) {
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
      <Link
        className="block pb-1 text-sm border-b"
        aria-label={`오늘의 이야기 적기: ${question.question}`}
        href={PATHS.ANSWER.byId(question.id)}
      >
        ✍️ 여기를 눌러서 오늘의 이야기를 적어봐 🥰
      </Link>
    </section>
  )
}
