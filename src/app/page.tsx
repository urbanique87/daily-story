// components
import QuestionHeader from "@/components/question/QuestionHeader"

const mockUser = {
  profileImage: "https://example.com/profile.jpg",
  nickname: "홍길동",
}

export default function Home() {
  return (
    <main>
      <QuestionHeader defaultUser={mockUser} />
    </main>
  )
}
