"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"

interface QuestionData {
  id: number
  date: string
  category: string
  question: string
}

/**
 * 질문 컴포넌트
 */
export default function QuestionSection() {
  const [questionData, setQuestionData] = useState<QuestionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/api/questions")
        setQuestionData(response.data)
      } catch (error) {
        setError("질문을 불러오는데 실패했습니다.")
        console.error("Failed to fetch question data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!questionData) {
    return <div>질문을 찾을 수 없습니다.</div>
  }

  return (
    <section>
      <div>{formatCustomDate(questionData.date)}</div>
      <div>
        오늘의 <span>{questionData.category}</span>
      </div>
      <p>{questionData.question}</p>
      <Link href={`/question/${questionData.id}/answer`}>
        ✍️ 여기를 눌러서 오늘의 이야기를 적어봐 🥰
      </Link>
    </section>
  )
}

function formatCustomDate(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new Error("유효하지 않은 날짜 형식입니다.")
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}
