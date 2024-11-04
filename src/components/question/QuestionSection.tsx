import Link from "next/link"

function formatCustomDate(dateString: string): string {
  // 입력받은 문자열을 Date 객체로 변환
  const date = new Date(dateString)

  // 날짜 유효성 검사
  if (isNaN(date.getTime())) {
    throw new Error("유효하지 않은 날짜 형식입니다.")
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }

  return new Intl.DateTimeFormat("en-GB", options).format(date)
}

/**
 * 질문 섹션
 */
export default function QuestionSection() {
  const id = 1
  const category = "일상"
  const question = "오늘, 가장 엉뚱했던 순간은 뭐였어?"

  return (
    <section>
      <div>{formatCustomDate("2024-11-04")}</div>
      <div>
        오늘의 <span>{category}</span>
      </div>
      <p>{question}</p>
      <Link href={`/question/${id}/answer`}>✍️ 여기를 눌러서 오늘의 이야기를 적어봐 🥰</Link>
    </section>
  )
}
