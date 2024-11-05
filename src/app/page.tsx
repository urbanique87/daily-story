// components
import QuestionHeader from "@/components/question/QuestionHeader"
import QuestionSection from "@/components/question/QuestionSection"

export const dynamic = "force-dynamic"

export default async function Home() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`)
  const data = await response.json()

  return (
    <main>
      <QuestionHeader defaultUser={data} />
      <div className="py-6">
        <QuestionSection />
      </div>
    </main>
  )
}
