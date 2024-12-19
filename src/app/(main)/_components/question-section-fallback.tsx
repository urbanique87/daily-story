/**
 * 질문 대체 컴포넌트
 */
export default function QuestionSectionFallback() {
  return (
    <section
      role="region"
      aria-labelledby="question-section-title"
      data-testid="question-section"
    >
      <p className="mb-1 text-sm font-bold">
        오늘의 질문을 불러오는 데 실패했습니다.
      </p>
      <p className="mb-1 text-sm">잠시 후에 다시 시도해주세요.</p>
    </section>
  )
}
