import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
// components
import QuestionSection from "@/components/question/QuestionSection"

/**
 * @description
 *
 * 요구사항:
 * 1. 오늘 날짜가 표시 (예: 14. Aug. 2019)
 * 2. 질문별 카테고리 표시 (예: 오늘의 ${category})
 * 3. 오늘 질문 표시
 * 4. 인풋처럼 보이는 링크 표시
 * 4-1. 링크 텍스트: ✍️ 여기를 눌러서 오늘의 이야기를 적어봐 🥰
 * 4-2. 링크 클릭시, 답변 페이지로 이동한다.
 */

describe("QuestionSection 컴포넌트", () => {
  describe("기본 렌더링", () => {
    beforeEach(() => {
      render(<QuestionSection />) // 컴포넌트를 렌더링합니다.
    })

    it("질문 섹션 컴포넌트가 렌더링되어야 한다", () => {})
  })
})
