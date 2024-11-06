"use client"

import { FormEvent, useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
// actions
import { signup } from "@/actions/auth"
// utils
import { validateEmail, validatePassword } from "@/lib/utils/validation"

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
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [, startTransition] = useTransition()

  const router = useRouter()

  // 클라이언트 측 유효성 검사
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    if (name === "email") {
      const { error } = validateEmail(value)
      setEmailError(error)
      return
    }

    if (name === "password") {
      const { error } = validatePassword(value)
      setPasswordError(error)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      setError("입력값을 확인해주세요.")
      setEmailError(emailValidation.error)
      setPasswordError(passwordValidation.error)
      return
    }

    try {
      startTransition(async () => {
        await signup(formData)

        setSuccess(true)

        form.reset()
        router.replace("/login")
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "회원가입 중 오류가 발생했습니다.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-5">
      {error && <div className="p-3 text-red-500 bg-red-100 rounded">{error}</div>}

      {success && (
        <div className="p-3 text-green-500 bg-green-100 rounded">회원가입이 완료되었습니다!</div>
      )}

      <div className="mb-1">
        <label htmlFor="email" className="block mb-2">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
      </div>

      <div className="mb-1">
        <label htmlFor="password" className="block mb-2">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
      </div>

      <SubmitButton />
    </form>
  )
}
