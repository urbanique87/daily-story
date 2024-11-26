import { createContext, ReactNode, useContext, useRef } from "react"
// types
import type { Question } from "@/types/question.types"

type AnswerContextType = {
  question: Question
  inputRef: React.RefObject<HTMLTextAreaElement>
  className?: string
}

const AnswerContext = createContext<AnswerContextType | null>(null)

export const useAnswerContext = () => {
  const context = useContext(AnswerContext)
  if (!context) {
    throw new Error(
      "useAnswerContext는 AnswerProvider 내에서만 사용 가능합니다."
    )
  }
  return context
}

export function AnswerProvider({
  question,
  className = "w-[40px] h-[40px]",
  children,
}: {
  question: Question
  className?: string
  children: ReactNode
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  return (
    <AnswerContext.Provider value={{ question, inputRef, className }}>
      {children}
    </AnswerContext.Provider>
  )
}
