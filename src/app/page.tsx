// components
import QuestionHeader from "@/components/question/QuestionHeader"
// constants
import { TEST_USER } from "@/constants/test_user"

export default function Home() {
  return (
    <main>
      <QuestionHeader defaultUser={TEST_USER} />
    </main>
  )
}
