import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
// components
import QuestionHeader from "@/components/question/QuestionHeader"
// constants
import { PATHS } from "@/constants/paths"
import { TIME_RANGES } from "@/constants/greetings"
// mocks
import { pushMock } from "@/__tests__/setup"

const MOCK_SESSION = {
  user: {
    id: "test-id",
    name: "Test User",
    email: "test@example.com",
    image: "https://example.com/image.jpg",
  },
  expires: "2024-12-31",
}

describe("QuestionHeader Component", () => {
  const originalEnv = process.env

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_DEFAULT_USER_IMAGE:
        "https://i.pinimg.com/236x/24/a5/ee/24a5eeb64f5e14327850731fc8f01bd9.jpg",
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe("Rendering Test", () => {
    it("헤더 컴포넌트가 렌더링 되어야 한다.", () => {
      render(<QuestionHeader session={MOCK_SESSION} />)
      expect(screen.getByRole("banner")).toBeInTheDocument()
    })

    it("기본 인사말이 올바르게 렌더링 되어야 한다.", () => {
      render(<QuestionHeader session={MOCK_SESSION} />)
      expect(screen.getByText(/Hi/)).toBeInTheDocument()
    })

    it("사용자의 닉네임이 렌더링 되어야 한다.", () => {
      render(<QuestionHeader session={MOCK_SESSION} />)
      expect(screen.getByText("Test User")).toBeInTheDocument()
    })

    it("사용자 닉네임이 없을 경우, 'Guest'가 렌더링 되어야 한다.", () => {
      const sessionWithoutName = {
        ...MOCK_SESSION,
        user: {
          ...MOCK_SESSION.user,
          name: "",
        },
      }

      render(<QuestionHeader session={sessionWithoutName} />)
      expect(screen.getByText("Guest")).toBeInTheDocument()
    })

    it("프로필 이미지가 없을 경우 기본 이미지로 표시되어야 한다.", () => {
      const sessionWithoutImage = {
        ...MOCK_SESSION,
        user: {
          ...MOCK_SESSION.user,
          image: null,
        },
      }

      render(<QuestionHeader session={sessionWithoutImage} />)
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE
      )
    })

    it("프로필 이미지에 적절한 alt 텍스트가 있어야 한다", () => {
      render(<QuestionHeader session={MOCK_SESSION} />)
      const img = screen.getByRole("img")
      expect(img).toHaveAttribute("alt", expect.any(String))
      expect(img.getAttribute("alt")).not.toBe("")
    })

    it.each(TIME_RANGES.map(({ start, greeting }) => [start, greeting]))(
      '%d시부터 "%s" 메시지가 표시되어야 한다',
      (start, greeting) => {
        jest.spyOn(Date.prototype, "getHours").mockReturnValue(start)
        render(<QuestionHeader session={MOCK_SESSION} />)

        const element = screen.getByText(greeting)
        expect(element).toBeInTheDocument()
        jest.restoreAllMocks()
      }
    )
  })

  describe("Link Test", () => {
    beforeEach(() => {
      render(<QuestionHeader session={MOCK_SESSION} />)
    })

    it("프로필 링크가 올바른 경로를 가져야 한다.", () => {
      expect(screen.getByRole("link")).toHaveAttribute("href", PATHS.PROFILE)
    })

    it("프로필 이미지 (링크) 클릭 시 프로필 페이지로 이동해야 한다.", async () => {
      const user = userEvent.setup()

      const image = screen.getByRole("img")
      await user.click(image)
      expect(pushMock).toHaveBeenCalledWith(PATHS.PROFILE)
    })
  })
})
