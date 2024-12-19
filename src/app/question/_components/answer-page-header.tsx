"use client"

import { useRouter } from "next/navigation"
// actions
import { saveAnswer } from "../_actions/answer-actions"
import { useAnswerContext } from "../_context/answer-provider"
// context

export function AnswerPageHeader() {
  const { question, inputRef } = useAnswerContext()

  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

  const handleSubmit = async () => {
    if (!inputRef.current) {
      return
    }

    await saveAnswer({
      questionId: question.id,
      answerText: inputRef.current.value.trim(),
    })
  }

  return (
    <header>
      <button type="button" onClick={handleBackClick}>
        뒤로가기
      </button>
      <button type="button" onClick={handleSubmit}>
        저장하기
      </button>
    </header>
  )
}
