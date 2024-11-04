export const TIME_BASED_GREETINGS = {
  MORNING: "Good Morning!",
  AFTERNOON: "Good Afternoon!",
  EVENING: "Good Evening!",
  NIGHT: "Good Night!",
} as const

export const TIME_RANGES = [
  { start: 0, end: 5, greeting: TIME_BASED_GREETINGS.EVENING },
  { start: 5, end: 12, greeting: TIME_BASED_GREETINGS.MORNING },
  { start: 12, end: 17, greeting: TIME_BASED_GREETINGS.AFTERNOON },
  { start: 17, end: 21, greeting: TIME_BASED_GREETINGS.EVENING },
  { start: 21, end: 24, greeting: TIME_BASED_GREETINGS.NIGHT },
] as const
