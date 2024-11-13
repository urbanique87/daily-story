export const PATHS = {
  MAIN: "/",
  SIGNUP: "/signup",
  SIGNIN: "/signin",
  SIGNOUT: "/signout",
  PROFILE: "/profile",
  ANSWER: {
    byId: (questionId: number) => `/question/${questionId}/answer`,
  },
}
