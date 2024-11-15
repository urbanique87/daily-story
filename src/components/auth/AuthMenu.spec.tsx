// import { useRouter } from "next/navigation"
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/react"
// components
import AuthMenu from "@/components/auth/AuthMenu"
// constants
import { PATHS } from "@/constants/paths"
// mocks
import { pushMock } from "@/__tests__/setup"

describe("AuthMenu Component", () => {
  beforeEach(() => {
    render(<AuthMenu />)
  })

  describe("Rendering Test", () => {
    it("이모지가 올바르게 렌더링되어야 한다.", () => {
      const emoji = screen.getByText("✍️")
      expect(emoji).toBeInTheDocument()
    })

    it("제목과 설명이 올바르게 렌더링되어야 한다.", () => {
      const heading = screen.getByRole("heading", {
        name: "Daily Story",
        level: 1,
      })
      expect(heading).toBeInTheDocument()

      const description = screen.getByText(
        "매일 새로운 질문으로 이야기를 기록해보세요."
      )
      expect(description).toBeInTheDocument()
    })
  })

  describe("Link Test", () => {
    it("회원가입과 로그인 링크가 올바른 경로를 가져야 한다.", async () => {
      const user = userEvent.setup()

      const signupLink = screen.getByRole("link", {
        name: "회원가입",
      })
      expect(signupLink).toHaveAttribute("href", PATHS.SIGNUP)

      await user.click(signupLink)
      expect(pushMock).toHaveBeenCalledWith(PATHS.SIGNUP)

      const signinLink = screen.getByRole("link", {
        name: "로그인",
      })
      expect(signinLink).toHaveAttribute("href", PATHS.SIGNIN)

      await user.click(signinLink)
      expect(pushMock).toHaveBeenCalledWith(PATHS.SIGNIN)
    })
  })
})
