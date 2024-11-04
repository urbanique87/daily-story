export const PATHS = {
  PROFILE: "/profile",
  ANSWER: {
    byId: (questionId: number) => `/question/${questionId}/answer`,
  },
}
