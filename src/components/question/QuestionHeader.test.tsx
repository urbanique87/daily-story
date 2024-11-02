/**
 * @description 질문 페이지 헤더 컴포넌트
 *
 * 요구사항:
 * 1. 간단한 인사말과 사용자 닉네임 표시 (예: Hi! 길동,)
 * 2. 시간대에 맞는 인사말 표시 (예: Good Morning!)
 * 3. 현재 사용자의 프로필 이미지 표시 (등록된 이미지 없을시 기본 이미지 표시)
 * 4. 사용자 프로필 이미지를 클릭하면 사용자 정보 페이지로 이동한다.
 */

import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import QuestionHeader from "@/components/question/QuestionHeader"

describe("QuestionHeader", () => {
  it("컴포넌트가 렌더링되어야 한다.", () => {
    render(<QuestionHeader />)
    expect(screen.getByRole("banner")).toBeInTheDocument()
  })
})
