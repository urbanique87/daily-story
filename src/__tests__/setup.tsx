import "@testing-library/jest-dom"

// fetch를 Jest mock function으로 설정
global.fetch = jest.fn() as jest.Mock

export const pushMock = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: pushMock,
  }),
}))

jest.mock("next/link", () => {
  return jest.fn(({ children, href }) => {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault()
          pushMock(href)
        }}
      >
        {children}
      </a>
    )
  })
})

beforeEach(() => {
  // 각 테스트 전에 모든 mock 초기화
  jest.clearAllMocks()
  // useRouter mock 초기화
  const { useRouter } = jest.requireMock("next/navigation")
  useRouter.mockImplementation(() => ({
    push: pushMock,
  }))
})
