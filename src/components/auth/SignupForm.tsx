"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
// actions
import { signup } from "@/actions/auth"

// Submit 버튼 컴포넌트
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "잠시만 기다려주세요" : "회원가입"}
    </button>
  )
}

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)

    try {
      await signup(formData)
      setSuccess(true)

      router.replace("/login") // 원하는 페이지로 리디렉션
    } catch (e) {
      setError(e instanceof Error ? e.message : "회원가입 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {error && <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded">{error}</div>}

      {success && (
        <div className="mb-4 p-3 text-sm text-green-500 bg-green-50 rounded">
          회원가입이 완료되었습니다!
        </div>
      )}

      <form action={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이메일을 입력해주세요"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="비밀번호를 입력해주세요"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}
