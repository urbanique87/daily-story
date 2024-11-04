import { useRouter } from "next/navigation"
import axios from "axios"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
// components
import QuestionSection from "@/components/question/QuestionSection"

/**
 * @description
 *
 * 요구사항:
 * 1. 질문이 제공된 오늘 날짜가 표시 (예: 14. Aug 2019)
 * 2. 질문별 카테고리 표시 (예: 오늘의 ${category})
 * 3. 오늘 질문 표시
 * 4. 인풋처럼 보이는 링크 표시
 * 4-1. 링크 텍스트: ✍️ 여기를 눌러서 오늘의 이야기를 적어봐 🥰
 * 4-2. 링크 클릭시, 답변 페이지로 이동한다.
 */

// Mock 데이터 중앙화
const mockQuestionData = {
  id: 1,
  date: "2024-11-04",
  category: "일상",
  question: "오늘, 가장 엉뚱했던 순간은 뭐였어?",
}

const mockLinkText = "✍️ 여기를 눌러서 오늘의 이야기를 적어봐 🥰"

// Mocks
jest.mock("axios")
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    const router = useRouter()
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault()
          router.push(href)
        }}
      >
        {children}
      </a>
    )
  }

  MockLink.displayName = "MockLink"
  return MockLink
})

describe("QuestionSection 컴포넌트", () => {
  const mockPush = jest.fn()
  let questionData: typeof mockQuestionData

  beforeEach(async () => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(axios.get as jest.Mock).mockResolvedValue({ data: mockQuestionData })

    render(<QuestionSection />)
    const response = await axios.get("")
    questionData = response.data
  })

  describe("기본 렌더링", () => {
    it("질문이 제공된 오늘 날짜가 표시되어야 한다", () => {
      const formattedDate = formatCustomDate(questionData.date)
      expect(screen.getByText(formattedDate)).toBeInTheDocument()
    })

    it("제공되는 질문의 카테고리가 표시되어야 한다", async () => {
      const baseText = screen.getByText("오늘의")
      const categorySpan = await screen.findByText(questionData.category)
      expect(baseText.parentElement).toContainElement(categorySpan)
    })

    it("제공되는 오늘의 질문이 표시되어야 한다", () => {
      expect(screen.getByText(questionData.question)).toBeInTheDocument()
    })

    it("답변을 입력 페이지로 이동하기 위한 안내 메시지가 표시되어야 한다", () => {
      const element = screen.getByRole("link")
      expect(element).toHaveTextContent(mockLinkText)
      expect(element).toHaveAttribute("href", `/question/${questionData.id}/answer`)
    })
  })

  describe("페이지 이동", () => {
    it("답변 입력 페이지 링크 클릭시 답변 입력 페이지로 이동해야 한다", async () => {
      const user = userEvent.setup()
      const element = screen.getByRole("link")

      await user.click(element)
      expect(mockPush).toHaveBeenCalledWith(`/question/${questionData.id}/answer`)
    })
  })
})

function formatCustomDate(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new Error("유효하지 않은 날짜 형식입니다.")
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}
