// constants
import { TIME_BASED_GREETINGS, TIME_RANGES } from "@/shared/constants"

type Greeting = (typeof TIME_BASED_GREETINGS)[keyof typeof TIME_BASED_GREETINGS]

export const getGreetingForHour = (hours: number): Greeting => {
  const range = TIME_RANGES.find(
    ({ start, end }) => hours >= start && hours < end
  )
  return range ? range.greeting : TIME_BASED_GREETINGS.INVALID
}

export function getTimeBasedGreeting(): Greeting {
  const localTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  })

  const hours = new Date(localTime).getHours()
  return getGreetingForHour(hours)
}
