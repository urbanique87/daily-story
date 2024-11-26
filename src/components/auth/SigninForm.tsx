"use client"

import { FormEvent, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
// hooks
import { useValidation } from "@/hooks/useValidation"
// components
import { InputField } from "@/components/ui/InputField"
// constants
import { PATHS } from "@/constants/paths"
import { ERROR_MESSAGES } from "@/constants/error"
// actions
import { signin } from "@/actions/signin.actions"

export function SigninForm() {
  const router = useRouter()

  const [formError, setFormError] = useState<string | null>(null)
  // const [success, setSuccess] = useState(false)

  const [isSubmitting, startTransition] = useTransition()

  const { errors, validateField } = useValidation()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (validateField("email", email) || validateField("password", password)) {
      return setFormError(ERROR_MESSAGES.VALIDATION_INVALID_INPUT)
    }

    startTransition(async () => {
      const response = await signin({ email, password })
      if (!response.success) {
        return setFormError(response.error.message)
      }

      // setSuccess(true)
      form.reset()

      // 리다이렉트 로직
      const callbackUrl = new URLSearchParams(window.location.search).get(
        "callbackUrl"
      )
      router.replace(callbackUrl || PATHS.MAIN)
    })
  }

  return (
    <div className="flex justify-center pt-[150px] pb-[50px] md:pt-[250px] md:pb-[100px] transition-all duration-500 ease-in-out">
      <form className="w-full max-w-[400px]" onSubmit={handleSubmit}>
        {/* TODO: 토스트 처리 */}
        {formError && (
          <div className="p-3 text-red-500 bg-red-100 rounded">{formError}</div>
        )}

        {/* TODO: 토스트 처리 */}
        {/* {success && (
          <div className="p-3 text-green-500 bg-green-100 rounded">
            로그인이 완료되었습니다!
          </div>
        )} */}

        <div className="mb-1">
          <InputField
            id="email"
            name="email"
            type="email"
            label="이메일"
            onChange={(event) =>
              validateField(event.target.name, event.target.value)
            }
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
            onChange={(event) =>
              validateField(event.target.name, event.target.value)
            }
            error={errors.password}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded disabled:bg-blue-300"
        >
          {isSubmitting ? "잠시만 기다려주세요" : "Login"}
        </button>
      </form>
    </div>
  )
}
