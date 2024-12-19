// components
import { SigninForm } from "@/app/(auth)/signin/_components/sign-in-form"
import Footer from "@/components/layout/footer"

/**
 * 로그인 페이지
 */
export default function SigninPage() {
  return (
    <section className="flex min-h-screen flex-col">
      <main className="flex items-center justify-center flex-grow px-8 pt-8 pb-12">
        <SigninForm />
      </main>
      <Footer />
    </section>
  )
}
