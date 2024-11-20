import { render, screen } from "@testing-library/react"
// components
import MainPage from "@/app/page"
// ㅣib
import { auth } from "@/lib/auth"
// api
import { fetchQuestion } from "@/service/question.service"

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}))

jest.mock("@/service/question.service", () => ({
  fetchQuestion: jest.fn(),
}))

const MOCK_QUESTION = {
  id: 1,
  date: "2024-11-04",
  category: "일상",
  question: "오늘, 가장 엉뚱했던 순간은 뭐였어?",
}

const MOCK_SESSION = {
  accessToken: "test-access-token",
  user: {
    id: "test-id",
    name: "Test User",
    email: "test@example.com",
    image: "https://example.com/image.jpg",
  },
  expires: "2024-12-31",
}

describe("MainPage Component", () => {
  it("사용자가 인증되지 않았을 경우, AuthMenu Component가 렌더링 되어야 한다.", async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)
    render(await MainPage())
    expect(screen.getByTestId("auth-menu")).toBeInTheDocument()
  })

  it("사용자가 인증되었을 경우, QuestionHeader component와 QuestionSection component가 렌더링 되어야 한다.", async () => {
    ;(auth as jest.Mock).mockResolvedValue(MOCK_SESSION)
    ;(fetchQuestion as jest.Mock).mockResolvedValue(MOCK_QUESTION)

    render(await MainPage())

    expect(screen.getByTestId("question-header")).toBeInTheDocument()
    expect(screen.getByTestId("question-section")).toBeInTheDocument()
  })

  it("should display an error message if fetchQuestion fails", async () => {
    ;(auth as jest.Mock).mockResolvedValue(MOCK_SESSION)

    // API 호출 실패 시 에러를 던지도록 설정
    const errorMessage = "Failed to fetch question"
    ;(fetchQuestion as jest.Mock).mockRejectedValue(new Error(errorMessage))

    // 에러가 throw되는지 확인
    await expect(MainPage()).rejects.toThrow(errorMessage)
  })
})
