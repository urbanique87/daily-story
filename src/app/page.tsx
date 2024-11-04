// components
import QuestionHeader from "@/components/question/QuestionHeader"
import QuestionSection from "@/components/question/QuestionSection"
// constants
import { TEST_USER } from "@/constants/test_user"

export default function Home() {
  return (
    <main>
      <QuestionHeader defaultUser={TEST_USER} />
      <div className="py-6">
        <QuestionSection />
      </div>
    </main>
  )
}
