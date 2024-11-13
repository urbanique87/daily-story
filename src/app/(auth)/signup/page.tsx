import { redirect } from "next/navigation"
// components
import Header from "@/components/common/Header"
import { SignupForm } from "@/components/auth/SignupForm"
// lib
import { auth } from "@/lib/auth"
// constants
import { PATHS } from "@/constants/paths"

/**
 * 회원 가입 페이지
 */
export default async function SignupPage() {
  const session = await auth()
  if (session) {
    redirect(PATHS.MAIN)
  }

  return (
    <>
      <Header />

      <main className="max-w-[600px] px-5 py-7 mx-auto">
        <SignupForm />
      </main>
    </>
  )
}
