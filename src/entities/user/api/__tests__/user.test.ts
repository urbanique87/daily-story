import { getUser, MOCK_USER } from "@/entities/user"
// lib
import { getEnv } from "@/shared/lib"

// fetch를 모킹하기 위해 필요한 설정
global.fetch = jest.fn()

describe("getUser function", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("응답이 성공하면 사용자 데이터를 반환해야 한다", async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_USER,
    })

    const result = await getUser()

    expect(result).toEqual(MOCK_USER)
    expect(fetch).toHaveBeenCalledWith(
      `${getEnv("NEXT_PUBLIC_BASE_URL")}/api/user`,
      {}
    )
  })

  it("응답이 실패하면 오류를 던져야 한다", async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    await expect(getUser()).rejects.toThrow("Failed to fetch user")
    expect(fetch).toHaveBeenCalledWith(
      `${getEnv("NEXT_PUBLIC_BASE_URL")}/api/user`,
      {}
    )
  })
})
