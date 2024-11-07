import { formatCustomDate } from "@/features/question"

describe("formatCustomDate", () => {
  it("올바른 날짜 문자열이 주어졌을 때, 포맷된 날짜를 반환해야 한다", () => {
    const dateString = "2024-11-06T00:00:00Z"
    const formattedDate = formatCustomDate(dateString)
    expect(formattedDate).toBe("06 Nov 2024")
  })

  it("유효하지 않은 날짜 문자열이 주어졌을 때, 에러를 던져야 한다", () => {
    const invalidDateString = "invalid-date"
    expect(() => formatCustomDate(invalidDateString)).toThrow(
      "유효하지 않은 날짜 형식입니다."
    )
  })
})
