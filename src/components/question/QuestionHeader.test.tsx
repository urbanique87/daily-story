import { useRouter } from "next/navigation"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
// components
import QuestionHeader from "@/components/question/QuestionHeader"
// constants
import { GREETINGS } from "@/constants/greetings"
import { TEST_USER } from "@/constants/test_user"

const TIME_RANGES = [
  { hour: 5, greeting: GREETINGS.MORNING },
  { hour: 12, greeting: GREETINGS.AFTERNOON },
  { hour: 18, greeting: GREETINGS.EVENING },
  { hour: 22, greeting: GREETINGS.NIGHT },
] as const

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
    return render(<QuestionHeader defaultUser={TEST_USER} />)
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
      expect(screen.getByText(TEST_USER.nickname)).toBeInTheDocument()
    })

    it("프로필 이미지가 올바른 속성으로 표시되어야 한다", () => {
      const element = screen.getByRole("img", {
        name: new RegExp(`${TEST_USER.nickname} profile`, "i"),
      })

      expect(element).toBeInTheDocument()
      expect(element).toHaveAttribute("src", TEST_USER.profileImage)
    })
  })

  describe("페이지 이동", () => {
    beforeEach(() => {
      renderHeader()
    })

    it("프로필 링크가 올바른 경로를 가져야 한다", () => {
      const element = screen.getByRole("link")
      expect(element).toHaveAttribute("href", "/profile")
    })

    it("프로필 링크 클릭시 프로필 페이지로 이동해야 한다", async () => {
      const user = userEvent.setup()
      const element = screen.getByRole("link")

      await user.click(element)
      expect(mockPush).toHaveBeenCalledWith("/profile")
    })
  })

  describe("시간대별 인사말", () => {
    TIME_RANGES.forEach(({ hour, greeting }) => {
      it(`${hour}시에는 "${greeting}" 메시지가 표시되어야 한다`, () => {
        jest.spyOn(Date.prototype, "getHours").mockReturnValue(hour)
        renderHeader()
        expect(screen.getByText(greeting)).toBeInTheDocument()
      })
    })
  })
})
