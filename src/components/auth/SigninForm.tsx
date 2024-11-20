"use client"

import { FormEvent, useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
// hooks
import { useValidation } from "@/hooks/useValidation"
// components
import { InputField } from "@/components/ui/InputField"
// constants
import { PATHS } from "@/constants/paths"
// actions
import { signin } from "@/actions/signin.actions"

export function SigninForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [, startTransition] = useTransition()

  const { errors, validateField } = useValidation()
  const { pending } = useFormStatus()
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
        const response = await signin({
          email,
          password,
        })

        if (!response.success) {
          switch (response.errorCode) {
            case "INVALID_INPUT":
              setError("이메일과 비밀번호를 모두 입력해주세요.")
              return
            case "INVALID_CREDENTIALS":
              setError("이메일 또는 비밀번호가 올바르지 않습니다.")
              return
            case "AUTH_ERROR":
              setError("로그인에 문제가 발생했습니다. 다시 시도해주세요.")
              return
            default:
              setError("알 수 없는 오류가 발생했습니다.")
              return
          }
        }

        setSuccess(true)

        // 폼 초기화
        form.reset()

        // 로그인 후, callbackUrl이 있다면 해당 URL로 리다이렉트
        const callbackUrl = new URLSearchParams(window.location.search).get(
          "callbackUrl"
        )
        if (callbackUrl) {
          // callbackUrl이 있으면 해당 URL로 리다이렉트
          router.replace(callbackUrl)
        } else {
          // 기본 메인 페이지로 이동
          router.replace(PATHS.MAIN)
        }
      })
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "로그인 중 오류가 발생했습니다."
      )
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* TODO: 토스트 처리 */}
      {error && (
        <div className="p-3 text-red-500 bg-red-100 rounded">{error}</div>
      )}

      {/* TODO: 토스트 처리 */}
      {success && (
        <div className="p-3 text-green-500 bg-green-100 rounded">
          로그인이 완료되었습니다!
        </div>
      )}

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
        disabled={pending}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded disabled:bg-blue-300"
      >
        {pending ? "잠시만 기다려주세요" : "Login"}
      </button>
    </form>
  )
}
