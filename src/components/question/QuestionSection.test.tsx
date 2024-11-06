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

const MESSAGES = {
  LOADING: "Loading...",
  ERROR: "질문을 불러오는데 실패했습니다.",
  NOT_FOUND: "질문을 찾을 수 없습니다.",
  WRITE_ANSWER: "✍️ 여기를 눌러서 오늘의 이야기를 적어봐 🥰",
} as const

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
  // 공통 모킹 설정
  const mockPush = jest.fn()
  const renderComponent = () => render(<QuestionSection />)

  // 콘솔 에러 억제
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterAll(() => {
    ;(console.error as jest.Mock).mockRestore()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  describe("상태별 렌더링", () => {
    it("초기 로딩 상태를 표시한다", async () => {
      // 응답을 지연시키는 Promise 생성
      const delay = new Promise((resolve) => setTimeout(resolve, 100))
      ;(axios.get as jest.Mock).mockImplementation(() => delay)

      renderComponent()
      expect(screen.getByText(MESSAGES.LOADING)).toBeInTheDocument()
    })

    it("API 에러 상태를 표시한다", async () => {
      // API 호출 실패 모킹
      ;(axios.get as jest.Mock).mockRejectedValueOnce(new Error("API 호출 실패"))
      await act(async () => renderComponent())
      expect(screen.getByRole("alert")).toHaveTextContent(MESSAGES.ERROR)
    })

    it("데이터가 없는 상태를 표시한다", async () => {
      // 빈 데이터 응답 모킹
      ;(axios.get as jest.Mock).mockResolvedValueOnce({ data: null })

      await act(async () => renderComponent())
      expect(screen.getByText(MESSAGES.NOT_FOUND)).toBeInTheDocument()
    })
  })

  describe("데이터 렌더링", () => {
    beforeEach(async () => {
      ;(axios.get as jest.Mock).mockResolvedValue({ data: MOCK_QUESTION_DATA })
      await act(async () => renderComponent())
    })

    it("날짜를 표시한다", () => {
      const formattedDate = formatCustomDate(MOCK_QUESTION_DATA.date)
      expect(screen.getByText(formattedDate)).toBeInTheDocument()
    })

    it("카테고리를 표시한다", async () => {
      const baseText = screen.getByText("오늘의")
      const categorySpan = await screen.findByText(MOCK_QUESTION_DATA.category)
      expect(baseText.parentElement).toContainElement(categorySpan)
    })

    it("질문을 표시한다", () => {
      expect(screen.getByText(MOCK_QUESTION_DATA.question)).toBeInTheDocument()
    })

    it("답변 작성 링크를 표시한다", () => {
      const element = screen.getByRole("link")
      expect(element).toHaveTextContent(MESSAGES.WRITE_ANSWER)
      expect(element).toHaveAttribute("href", PATHS.ANSWER.byId(MOCK_QUESTION_DATA.id))
    })
  })

  describe("사용자 인터랙션", () => {
    it("링크 클릭 시 답변 작성 페이지로 이동한다", async () => {
      // API 응답 모킹 설정
      ;(axios.get as jest.Mock).mockResolvedValue({ data: MOCK_QUESTION_DATA })

      await act(async () => renderComponent())

      const user = userEvent.setup()
      await user.click(screen.getByRole("link"))

      expect(mockPush).toHaveBeenCalledWith(PATHS.ANSWER.byId(MOCK_QUESTION_DATA.id))
    })
  })
})
