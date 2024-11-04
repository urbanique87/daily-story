import { useRouter } from "next/navigation"
import axios from "axios"
import "@testing-library/jest-dom"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
// components
import QuestionSection from "@/components/question/QuestionSection"
// mocks
import { MOCK_QUESTION_DATA } from "@/mocks/question"
// libs
import { formatCustomDate } from "@/lib/dateFormatter"
import { PATHS } from "@/constants/paths"

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

  beforeEach(async () => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    // API 응답 모킹 설정
    ;(axios.get as jest.Mock).mockResolvedValue({ data: MOCK_QUESTION_DATA })

    // act로 감싸서 렌더링
    await act(async () => render(<QuestionSection />))
  })

  describe("기본 렌더링", () => {
    it("질문이 제공된 오늘 날짜가 표시되어야 한다", () => {
      const formattedDate = formatCustomDate(MOCK_QUESTION_DATA.date)
      expect(screen.getByText(formattedDate)).toBeInTheDocument()
    })

    it("제공되는 질문의 카테고리가 표시되어야 한다", async () => {
      const baseText = screen.getByText("오늘의")
      const categorySpan = await screen.findByText(MOCK_QUESTION_DATA.category)
      expect(baseText.parentElement).toContainElement(categorySpan)
    })

    it("제공되는 오늘의 질문이 표시되어야 한다", () => {
      expect(screen.getByText(MOCK_QUESTION_DATA.question)).toBeInTheDocument()
    })

    it("답변을 입력 페이지로 이동하기 위한 안내 메시지가 표시되어야 한다", () => {
      const element = screen.getByRole("link")
      expect(element).toHaveTextContent(mockLinkText)
      expect(element).toHaveAttribute("href", PATHS.ANSWER.byId(MOCK_QUESTION_DATA.id))
    })
  })

  describe("페이지 이동", () => {
    it("답변 입력 페이지 링크 클릭시 답변 입력 페이지로 이동해야 한다", async () => {
      const user = userEvent.setup()
      const element = screen.getByRole("link")

      await user.click(element)
      expect(mockPush).toHaveBeenCalledWith(PATHS.ANSWER.byId(MOCK_QUESTION_DATA.id))
    })
  })
})
