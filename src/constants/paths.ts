export const PATHS = {
  MAIN: "/",
  SIGNUP: "/signup",
  SINGIN: "/signin",
  PROFILE: "/profile",
  ANSWER: {
    byId: (questionId: number) => `/question/${questionId}/answer`,
  },
}
