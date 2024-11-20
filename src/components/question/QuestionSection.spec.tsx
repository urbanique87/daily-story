import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
// components
import QuestionSection from "@/components/question/QuestionSection"
// libs
import { formatCustomDate } from "@/lib/dateFormatter"
// constants
import { PATHS } from "@/constants/paths"
// mocks
import { pushMock } from "@/__tests__/setup"

export const MOCK_QUESTION = {
  id: 1,
  date: "2024-11-04",
  category: "일상",
  question: "오늘, 가장 엉뚱했던 순간은 뭐였어?",
}

describe("QuestionSection Component", () => {
  beforeEach(() => {
    render(<QuestionSection question={MOCK_QUESTION} />)
  })

  describe("Rendering Test", () => {
    it("오늘 날짜가 올바르게 렌더링 되어야 한다.", () => {
      const element = screen.getByText(formatCustomDate(MOCK_QUESTION.date))
      expect(element).toHaveTextContent("04 Nov 2024")
    })

    it("카테고리가 올바르게 렌더링 되어야 한다.", () => {
      const baseElement = screen.getByText(/오늘의/, { selector: "p" })
      const categoryElement = screen.getByText(MOCK_QUESTION.category)
      expect(baseElement).toBeInTheDocument()
      expect(baseElement).toContainElement(categoryElement)
    })

    it("질문이 올바르게 렌더링 되어야 한다.", () => {
      expect(screen.getByText(MOCK_QUESTION.question)).toBeInTheDocument()
    })
  })

  describe("Link Test", () => {
    it("답변 작성 링크가 올바른 경로를 가져야 한다.", async () => {
      const link = screen.getByRole("link", {
        name: "✍️ 여기를 눌러서 오늘의 이야기를 적어봐 🥰",
      })
      expect(link).toHaveAttribute("href", PATHS.ANSWER.byId(MOCK_QUESTION.id))

      const user = userEvent.setup()
      await user.click(link)
      expect(pushMock).toHaveBeenCalledWith(PATHS.ANSWER.byId(MOCK_QUESTION.id))
    })
  })
})
