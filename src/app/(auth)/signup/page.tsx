import { SignupForm } from "@/components/auth/SignupForm"
import Header from "@/components/common/Header"

/**
 * 회원 가입 페이지
 */
export default function SignupPage() {
  return (
    <>
      <Header />

      <main className="max-w-[600px] px-5 py-7 mx-auto">
        <SignupForm />
      </main>
    </>
  )
}
