"use client"

import { FormEvent, useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
// actions
import { signup } from "@/actions/signup.actions"
// hooks
import { useValidation } from "@/hooks/useValidation"
// components
import { InputField } from "@/components/common/InputField"
// constants
import { PATHS } from "@/constants/paths"

// Submit 버튼 컴포넌트
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 text-white bg-blue-500 rounded disabled:bg-blue-300"
    >
      {pending ? "잠시만 기다려주세요" : "회원가입"}
    </button>
  )
}

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [, startTransition] = useTransition()
  const { errors, validateField } = useValidation()
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (validateField("email", email) || validateField("password", password)) {
      setError("입력값을 확인해주세요.")
      return
    }

    try {
      startTransition(async () => {
        const response = await signup(formData)
        if (!response.success) {
          switch (response.errorCode) {
            case "MISSING_FIELDS":
              setError("이메일과 비밀번호는 필수입니다.")
              return
            case "INVALID_FORMAT":
              setError("잘못된 입력 형식입니다.")
              return
            case "USER_EXISTS":
              setError("이미 존재하는 사용자입니다.")
              return
            default:
              setError("알 수 없는 오류가 발생했습니다.")
              return
          }
        }

        setSuccess(true)

        form.reset()
        router.replace(PATHS.MAIN)
      })
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "회원가입 중 오류가 발생했습니다."
      )
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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

      <SubmitButton />
    </form>
  )
}
