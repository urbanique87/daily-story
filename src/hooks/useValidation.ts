import { useState } from "react"
// utils
import { validators } from "@/utils/validation"

export function useValidation() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: string) => {
    if (!validators[name]) {
      return null
    }

    for (const validator of validators[name]) {
      const errorMessage = validator(value)
      if (errorMessage) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: errorMessage,
        }))
        return errorMessage
      }

      // 에러가 없으면 해당 필드 에러 제거
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    return null
  }

  const validateAllFields = (fields: Record<string, string>) => {
    const newErrors: Record<string, string> = {}

    for (const [name, value] of Object.entries(fields)) {
      if (!validators[name]) {
        continue
      }

      for (const validator of validators[name]) {
        const errorMessage = validator(value)
        if (!errorMessage) {
          continue
        }

        newErrors[name] = errorMessage
      }
    }

    setFieldErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearErrors = () => {
    setFieldErrors({})
  }

  return { fieldErrors, validateField, validateAllFields, clearErrors }
}
