import { useAnswerContext } from "../_context/answer-provider"

export function AnswerTextarea() {
  const { question, inputRef } = useAnswerContext()

  return (
    <div className="">
      <textarea
        ref={inputRef}
        autoFocus
        placeholder="Your answer here..."
        defaultValue={question.answer || ""}
      />
    </div>
  )
}
