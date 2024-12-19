import { createContext } from "react"
// types
import { AnswerContextType } from "./types"

// ----------------------------------------------------------------------

export const AnswerContext = createContext<AnswerContextType | null>(null)
