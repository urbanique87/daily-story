import type { RefObject } from "react"
import type { Question } from "@/types/question.types"

// ----------------------------------------------------------------------

export type AnswerContextType = {
  question: Question
  inputRef: RefObject<HTMLTextAreaElement | null>
  className?: string
}

export type AnswerProviderProps = {
  question: Question
  className?: string
  children: React.ReactNode
}
