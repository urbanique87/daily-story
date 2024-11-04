import { useRouter } from "next/navigation"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
// components
import QuestionHeader from "@/components/question/QuestionHeader"

/**
 * @description 질문 페이지 헤더 컴포넌트
 *
 * 요구사항:
 * 1. 간단한 인사말과 사용자 닉네임 표시 (예: Hi! 길동,)
 * 2. 시간대에 맞는 인사말 표시 (예: Good Morning!)
 * 3. 현재 사용자의 프로필 이미지 표시 (등록된 이미지 없을시 기본 이미지 표시)
 * 4. 사용자 프로필 이미지를 클릭하면 사용자 정보 페이지로 이동한다.
 */

const mockUser = {
  profileImage: "https://example.com/profile.jpg",
  nickname: "홍길동",
}

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

describe("QuestionHeader", () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    render(<QuestionHeader defaultUser={mockUser} />)
  })

  it("컴포넌트가 렌더링되어야 한다.", () => {
    expect(screen.getByRole("banner")).toBeInTheDocument()
  })

  it("간단한 인사말을 표시해야 한다.", () => {
    expect(screen.getByText(/Hi/)).toBeInTheDocument()
  })

  it("사용자 닉네임을 표시해야 한다.", () => {
    expect(screen.getByText(mockUser.nickname)).toBeInTheDocument()
  })

  it("사용자 프로필 이미지를 표시해야 한다.", () => {
    const element = screen.getByRole("img", {
      name: new RegExp(`${mockUser.nickname} profile`, "i"),
    })
    expect(element).toBeInTheDocument()
    expect(element).toHaveAttribute("src", mockUser.profileImage)
  })

  it("프로필 링크가 올바른 경로를 가져야 한다.", () => {
    const element = screen.getByRole("link")
    expect(element).toHaveAttribute("href", "/profile")
  })

  it("프로필 링크 클릭 시 사용자 정보 페이지로 이동해야 한다.", async () => {
    const user = userEvent.setup()
    const element = screen.getByRole("link")
    await user.click(element)
    expect(mockPush).toHaveBeenCalledWith("/profile")
  })

  describe("시간대별 인사말", () => {
    // 여러 시간대 테스트
    const greetingTests = [
      { hour: 9, expected: /good morning/i },
      { hour: 14, expected: /good afternoon/i },
      { hour: 20, expected: /good evening/i },
      { hour: 22, expected: /good night/i },
    ]

    greetingTests.forEach(({ hour, expected }) => {
      it("시간대별 인사말을 표시해야 한다.", () => {
        jest.spyOn(Date.prototype, "getHours").mockReturnValue(hour)
        render(<QuestionHeader defaultUser={mockUser} />)
        expect(screen.getByText(expected)).toBeInTheDocument()
      })
    })
  })
})
