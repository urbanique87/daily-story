"use client"

import { useContext, useRef } from "react"
// context
import { AnswerContext } from "./answer-context"
// types
import { AnswerProviderProps } from "./types"

// ----------------------------------------------------------------------

export const useAnswerContext = () => {
  const context = useContext(AnswerContext)
  if (!context) {
    throw new Error(
      "useAnswerContext는 AnswerProvider 내에서만 사용 가능합니다."
    )
  }
  return context
}

// ----------------------------------------------------------------------

export function AnswerProvider({
  question,
  className = "w-[40px] h-[40px]",
  children,
}: AnswerProviderProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  return (
    <AnswerContext.Provider value={{ question, inputRef, className }}>
      {children}
    </AnswerContext.Provider>
  )
}
