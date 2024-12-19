// components
import { SignupForm } from "@/app/(auth)/signup/_components/sign-up-form"
import Footer from "@/components/layout/footer"

/**
 * 회원 가입 페이지
 */
export default function SignupPage() {
  return (
    <section className="flex min-h-screen flex-col">
      <main className="flex items-center justify-center flex-grow px-8 pt-8 pb-12">
        <SignupForm />
      </main>
      <Footer />
    </section>
  )
}
