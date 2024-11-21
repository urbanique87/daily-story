// components
import { SigninForm } from "@/components/auth/SigninForm"

/**
 * 로그인 페이지
 */
export default async function SigninPage() {
  return (
    <main className="max-w-[960px] px-4 mx-auto">
      <SigninForm />
    </main>
  )
}
