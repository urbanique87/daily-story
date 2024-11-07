import { useState } from "react"
import { validateEmail, validatePassword } from "@/lib/utils/validation"

export function useValidation() {
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})

  const validateField = (name: string, value: string) => {
    let error = null
    if (name === "email") {
      error = validateEmail(value).error
    } else if (name === "password") {
      error = validatePassword(value).error
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
    return error
  }

  return { errors, validateField }
}
