// lib
import { getEnv } from "@/shared/lib"

describe("getEnv", () => {
  // 테스트 전 환경 변수 설정
  beforeAll(() => {
    process.env.TEST_ENV = "test_env"
  })

  // 테스트 후 환경 변수 정리
  afterAll(() => {
    delete process.env.TEST_ENV
  })

  it("환경 변수가 존재하면 값을 반환해야 한다", () => {
    const result = getEnv("TEST_ENV")
    expect(result).toBe("test_env")
  })

  it("환경 변수가 없으면 에러를 던져야 한다.", () => {
    expect(() => getEnv("NON_EXISTENT_ENV")).toThrow(
      "NON_EXISTENT_ENV 환경변수가 필요합니다."
    )
  })
})
