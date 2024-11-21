import { render, screen, waitFor, act } from "@testing-library/react"
// components
import QuestionHeader from "@/components/question/QuestionHeader"
// constants
import { TIME_RANGES } from "@/constants/greetings"

interface MockImage extends HTMLImageElement {
  onload: (() => void) | null
  onerror: (() => void) | null
}

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
    const mockImage: MockImage = {
      onload: null,
      onerror: null,
      src: "",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      setAttribute: jest.fn(),
      getAttribute: jest.fn(),
      style: {} as CSSStyleDeclaration,
    } as unknown as MockImage

    global.Image = jest.fn().mockImplementation(() => {
      const instance = Object.create(mockImage)

      setTimeout(() => {
        if (instance.onload) {
          instance.onload()
        }
      }, 0)

      return instance
    }) as unknown as typeof Image

    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_DEFAULT_USER_IMAGE:
        "https://i.pinimg.com/236x/24/a5/ee/24a5eeb64f5e14327850731fc8f01bd9.jpg",
    }
  })

  afterAll(() => {
    process.env = originalEnv

    global.Image = Image
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

    it("프로필 이미지가 없을 경우 기본 이미지로 표시되어야 한다.", async () => {
      const sessionWithoutImage = {
        ...MOCK_SESSION,
        user: {
          ...MOCK_SESSION.user,
          image: null,
        },
      }

      render(<QuestionHeader session={sessionWithoutImage} />)

      const initial = sessionWithoutImage.user.name[0].toUpperCase()
      // 초기에는 Fallback이 보여야 함
      expect(screen.getByText(initial)).toBeInTheDocument()

      // 이미지 로딩이 완료될 때까지 기다림
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0))
      })

      // 기본 이미지가 로드될 때까지 기다린 후, 기본 이미지로 확인
      await waitFor(() => {
        const img = screen.getByRole("img")
        expect(img).toHaveAttribute(
          "src",
          process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE
        )
      })

      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE
      )
    })

    it("프로필 이미지에 적절한 alt 텍스트가 있어야 한다", async () => {
      render(<QuestionHeader session={MOCK_SESSION} />)

      await waitFor(() => {
        const img = screen.getByRole("img")
        expect(img).toHaveAttribute("alt", expect.any(String))
        expect(img.getAttribute("alt")).not.toBe("")
      })
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
})
