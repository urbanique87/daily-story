// components
import Header from "@/components/common/Header"
import { SigninForm } from "@/components/auth/SigninForm"

/**
 * 로그인 페이지
 */
export default function SigninPage() {
  return (
    <>
      <Header />

      <main className="max-w-[600px] px-5 py-7 mx-auto">
        <SigninForm />
      </main>
    </>
  )
}
