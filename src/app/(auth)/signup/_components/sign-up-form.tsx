"use client"

import { FormEvent, useState, useTransition } from "react"
// import { useRouter } from "next/navigation"
// hooks
import { useValidation } from "@/hooks/useValidation"
// components
import { InputField } from "@/components/ui/InputField"
import { Text } from "@/components/ui/typography/Text"
// constants
// import { PATHS } from "@/constants/paths"
import { ERROR_MESSAGES } from "@/constants/error"
// actions
// import { signup } from "@/actions/signup-actions"
// utils
import { useCreateModal } from "@/utils/modal"

export function SignupForm() {
  // const router = useRouter()

  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)

  const [isSubmitting, startTransition] = useTransition()

  const { fieldErrors, validateAllFields } = useValidation()

  const { open } = useCreateModal()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const isValidAllFields = validateAllFields({ email, password })
    if (!isValidAllFields) {
      return
    }

    startTransition(async () => {
      try {
        // const response = await signup(formData)
        // if (!response.success) {
        //   return setFormErrorMessage(response.error.message)
        // }

        open({
          type: "success",
          title: "회원가입 완료",
          message: "환영합니다! \n서비스를\n 이용 하실 수 있습니다.",
        })

        form.reset()

        // router.replace(PATHS.MAIN)
      } catch (error) {
        console.error(error)
        setFormErrorMessage(ERROR_MESSAGES.AUTH_LOGIN_FAILED)
      }
    })
  }

  return (
    <div className="flex justify-center w-full">
      {/* left side */}
      <div className="hidden grow max-w-[350px] md:block">
        <div className="text-4xl mb-2">✍️</div>
        Q.hello wordl? <br />
        A. typing....
      </div>

      {/* right side */}
      <div className="grow max-w-[350px]">
        <div className="">
          <Text as="h1" size="3xl" className="mb-4 font-bold">
            Register.
          </Text>

          <Text as="p" size="sm" className="mb-14">
            반가워요,
          </Text>
        </div>

        {/* TODO: 토스트 처리 */}
        {/* {success && (
          <div className="p-3 text-green-500 bg-green-100 rounded">
            회원가입이 완료되었습니다!
          </div>
        )} */}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <InputField
              id="email"
              name="email"
              type="email"
              label="E-mail"
              placeholder="example@example.com"
              pattern="^[a-zA-Z0-9._%+\-']+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
              errorMessage={fieldErrors.email}
              required
            />
          </div>

          <div className="mb-4">
            <InputField
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="********"
              minLength={8}
              errorMessage={fieldErrors.password}
              required
            />
          </div>

          <div className="pb-4 text-center">
            {formErrorMessage && (
              <Text size="sm" className="text-red-500">
                {formErrorMessage}
              </Text>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-white bg-blue-500 rounded disabled:bg-blue-300"
          >
            {isSubmitting ? "잠시만 기다려주세요" : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  )
}
