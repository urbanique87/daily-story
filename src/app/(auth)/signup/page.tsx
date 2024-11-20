// components
import { SignupForm } from "@/components/auth/SignupForm"

/**
 * 회원 가입 페이지
 */
export default async function SignupPage() {
  return (
    <main className="max-w-[400px] px-5 py-7 mx-auto">
      <SignupForm />
    </main>
  )
}
