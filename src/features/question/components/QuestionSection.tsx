"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
// libs
import { formatCustomDate } from "@/features/question"
// constants
import { PATHS } from "@/shared/constants"

interface QuestionData {
  id: number
  date: string
  category: string
  question: string
}

/**
 * 질문 컴포넌트
 */
export function QuestionSection() {
  const [questionData, setQuestionData] = useState<QuestionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/api/question")
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
    return (
      <div className="px-5" role="status" aria-live="polite">
        Loading...
      </div>
    )
  }

  if (error) {
    return <div role="alert">{error}</div>
  }

  if (!questionData) {
    return <div>질문을 찾을 수 없습니다.</div>
  }

  return (
    <section
      className="px-5"
      role="region"
      aria-labelledby="question-section-title"
    >
      <p className="mb-1 text-sm text-gray-400">
        {formatCustomDate(questionData.date)}
      </p>
      <p className="mb-1 text-base">
        오늘의 <span>{questionData.category}</span>
      </p>
      <h2 className="mb-7 text-2xl font-bold">{questionData.question}</h2>
      <Link
        className="block pb-1 text-sm border-b"
        aria-label={`오늘의 이야기 적기: ${questionData.question}`}
        href={PATHS.ANSWER.byId(questionData.id)}
      >
        ✍️ 여기를 눌러서 오늘의 이야기를 적어봐 🥰
      </Link>
    </section>
  )
}
