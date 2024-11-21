declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BASE_URL: string
    NEXT_PUBLIC_DEFAULT_USER_IMAGE: string

    ACCESS_TOKEN_SECRET: string
    REFRESH_TOKEN_SECRET: string
  }
}
