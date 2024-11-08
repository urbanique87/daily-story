"use client"

import { FormEvent, useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
// actions
import { signup } from "@/features/auth"
// hooks
import { useValidation } from "@/shared/hooks"
// components
import { InputField } from "@/shared/components"
// context
import { useAuth } from "@/shared/context"

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

/**
 * 회원가입 페이지
 */
export function SignupForm() {
  const router = useRouter()
  const { setUser, setAccessToken } = useAuth()

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [, startTransition] = useTransition()
  const { errors, validateField } = useValidation()

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
        const result = await signup(formData)
        const { user, accessToken } = result
        // 응답에서 사용자 정보와 액세스 토큰을 받아 AuthContext에 저장한다.
        setUser(user)
        setAccessToken(accessToken)
        setSuccess(true)

        form.reset()
        router.replace("/")
      })
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "회원가입 중 오류가 발생했습니다."
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-5">
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
