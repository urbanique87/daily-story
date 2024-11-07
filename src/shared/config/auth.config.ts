export const AUTH_CONFIG = {
  ACCESS_TOKEN: {
    EXPIRES_IN: "1h",
    ALGORITHM: "HS256" as const,
  },
  REFRESH_TOKEN: {
    EXPIRES_IN: "14d",
    ALGORITHM: "HS256" as const,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    SALT_ROUNDS: 10,
  },
} as const
