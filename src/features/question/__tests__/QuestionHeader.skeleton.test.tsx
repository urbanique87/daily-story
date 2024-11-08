import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
// components
import { QuestionHeaderSkeleton } from "@/features/question"

describe("QuestionHeaderSkeleton", () => {
  it("컴포넌트가 정상적으로 렌더링된다.", () => {
    render(<QuestionHeaderSkeleton />)

    // 애니메이션 클래스 확인
    const animatedDivs = document.querySelectorAll(".animate-pulse")
    // 예상되는 각 div 요소들이 렌더링되었는지 확인
    expect(animatedDivs).toHaveLength(3)
  })
})
