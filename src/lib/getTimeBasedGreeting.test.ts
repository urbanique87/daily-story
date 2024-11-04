// constants
import { TIME_BASED_GREETINGS, TIME_RANGES } from "@/constants/greetings"
// lib
import { getGreetingForHour, getTimeBasedGreeting } from "@/lib/getTimeBasedGreeting"

describe("인사말 관련 함수 테스트", () => {
  describe("getGreetingForHour (시간별 인사말 반환 함수)", () => {
    it.each([
      { hours: 3, expected: TIME_BASED_GREETINGS.EVENING, description: "새벽 3시" },
      { hours: 7, expected: TIME_BASED_GREETINGS.MORNING, description: "아침 7시" },
      { hours: 14, expected: TIME_BASED_GREETINGS.AFTERNOON, description: "오후 2시" },
      { hours: 19, expected: TIME_BASED_GREETINGS.EVENING, description: "저녁 7시" },
      { hours: 22, expected: TIME_BASED_GREETINGS.NIGHT, description: "밤 10시" },
    ])("$description에는 $expected 인사말을 반환해야 한다", ({ hours, expected }) => {
      expect(getGreetingForHour(hours)).toBe(expected)
    })

    it("유효하지 않은 시간에는 기본 인사말을 반환해야 한다", () => {
      expect(getGreetingForHour(24)).toBe(TIME_BASED_GREETINGS.INVALID)
      expect(getGreetingForHour(25)).toBe(TIME_BASED_GREETINGS.INVALID)

      // 소수점 시간 (선택적)
      expect(getGreetingForHour(13.5)).toBe(TIME_BASED_GREETINGS.AFTERNOON)
    })
  })

  describe("getTimeBasedGreeting (현재 시간 기준 인사말 반환 함수)", () => {
    const mockDate = (hours: number) => {
      const mockDate = new Date(2024, 0, 1, hours, 0, 0)
      jest
        .spyOn(global, "Date")
        .mockImplementation(() => mockDate)
        .mockImplementationOnce(() => mockDate)
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it.each(TIME_RANGES)(
      "$start시부터 $end시 사이에는 $greeting을 반환해야 한다",
      ({ start, end, greeting }) => {
        mockDate(start)
        expect(getTimeBasedGreeting()).toBe(greeting)

        if (end > start) {
          mockDate(end - 1)
          expect(getTimeBasedGreeting()).toBe(greeting)
        }
      }
    )

    // 시간대 경계값 테스트
    it.each([
      { hours: 5, expected: TIME_BASED_GREETINGS.MORNING, description: "아침 시작" },
      { hours: 12, expected: TIME_BASED_GREETINGS.AFTERNOON, description: "오후 시작" },
      { hours: 17, expected: TIME_BASED_GREETINGS.EVENING, description: "저녁 시작" },
      { hours: 21, expected: TIME_BASED_GREETINGS.NIGHT, description: "밤 시작" },
    ])("$description 시점에 정확한 인사말로 전환되어야 한다", ({ hours, expected }) => {
      mockDate(hours)
      expect(getTimeBasedGreeting()).toBe(expected)
    })
  })

  describe("예외 상황 처리", () => {
    it("시간대 범위의 경계값이 정상적으로 처리되어야 한다", () => {
      TIME_RANGES.forEach(({ start, end, greeting }) => {
        // 시작 시간 테스트
        expect(getGreetingForHour(start)).toBe(greeting)

        // 끝 시간 직전 테스트
        if (end) {
          expect(getGreetingForHour(end - 1)).toBe(greeting)
        }
      })
    })
  })
})
