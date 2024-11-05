import { useRouter } from "next/navigation"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
// components
import QuestionHeader from "@/components/question/QuestionHeader"
// mocks
import { MOCK_USER } from "@/mocks/user"
// constants
import { PATHS } from "@/constants/paths"
import { TIME_RANGES } from "@/constants/greetings"

// Mocks
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

describe("QuestionHeader 컴포넌트", () => {
  const mockPush = jest.fn()

  const renderHeader = () => {
    return render(<QuestionHeader defaultUser={MOCK_USER} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  describe("기본 렌더링", () => {
    beforeEach(() => {
      renderHeader()
    })

    it("헤더 컴포넌트가 렌더링되어야 한다", () => {
      expect(screen.getByRole("banner")).toBeInTheDocument()
    })

    it("기본 인사말이 표시되어야 한다", () => {
      expect(screen.getByText(/Hi/)).toBeInTheDocument()
    })

    it("사용자의 닉네임이 표시되어야 한다", () => {
      expect(screen.getByText(MOCK_USER.nickname)).toBeInTheDocument()
    })

    it("프로필 이미지가 올바른 속성으로 표시되어야 한다", () => {
      const element = screen.getByRole("img", {
        name: new RegExp(`${MOCK_USER.nickname} profile`, "i"),
      })

      expect(element).toBeInTheDocument()
      expect(element).toHaveAttribute("src", MOCK_USER.profileImage)
    })
  })

  describe("페이지 이동", () => {
    beforeEach(() => {
      renderHeader()
    })

    it("프로필 링크가 올바른 경로를 가져야 한다", () => {
      const element = screen.getByRole("link")
      expect(element).toHaveAttribute("href", PATHS.PROFILE)
    })

    it("프로필 링크 클릭시 프로필 페이지로 이동해야 한다", async () => {
      const user = userEvent.setup()
      const element = screen.getByRole("link")

      await user.click(element)
      expect(mockPush).toHaveBeenCalledWith(PATHS.PROFILE)
    })
  })

  describe("시간대별 인사말", () => {
    it.each(TIME_RANGES.map(({ start, end, greeting }) => [start, end, greeting]))(
      '%d시부터 %d시까지는 "%s" 메시지가 표시되어야 한다',
      (start, end, greeting) => {
        jest.spyOn(Date.prototype, "getHours").mockReturnValue(start)
        renderHeader()
        expect(screen.getByText(greeting)).toBeInTheDocument()
      }
    )
  })
})
