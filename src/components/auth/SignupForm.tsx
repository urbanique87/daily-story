"use client"

import { FormEvent, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
// actions
import { signup } from "@/actions/signup.actions"
// hooks
import { useValidation } from "@/hooks/useValidation"
// components
import { InputField } from "@/components/ui/InputField"
// constants
import { PATHS } from "@/constants/paths"
import { ERROR_MESSAGES } from "@/constants/error"

export function SignupForm() {
  const router = useRouter()

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [isSubmitting, startTransition] = useTransition()

  const { errors, validateField } = useValidation()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (validateField("email", email) || validateField("password", password)) {
      return setError(ERROR_MESSAGES.VALIDATION_INVALID_INPUT)
    }

    startTransition(async () => {
      const response = await signup(formData)
      if (!response.success) {
        return setError(response.error.message)
      }

      setSuccess(true)
      form.reset()

      router.replace(PATHS.MAIN)
    })
  }

  return (
    <div className="flex justify-center pt-[150px] pb-[50px] md:pt-[250px] md:pb-[100px] transition-all duration-500 ease-in-out">
      <form className="w-full max-w-[400px]" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-red-500 bg-red-100 rounded">{error}</div>
        )}

        {success && (
          <div className="p-3 text-green-500 bg-green-100 rounded">
            회원가입이 완료되었습니다!
          </div>
        )}

        <div className="mb-1">
          <InputField
            id="email"
            name="email"
            type="email"
            label="이메일"
            onChange={(e) => validateField(e.target.name, e.target.value)}
            error={errors.email}
            required
          />
        </div>

        <div className="mb-1">
          <InputField
            id="password"
            name="password"
            type="password"
            label="비밀번호"
            onChange={(e) => validateField(e.target.name, e.target.value)}
            error={errors.password}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded disabled:bg-blue-300"
        >
          {isSubmitting ? "잠시만 기다려주세요" : "회원가입"}
        </button>
      </form>
    </div>
  )
}
