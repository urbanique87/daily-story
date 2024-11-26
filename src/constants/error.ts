export const ErrorCodeMap = {
  // Authentication Errors
  AUTH_UNAUTHORIZED: {
    code: "AUTH_UNAUTHORIZED",
    message: "인증되지 않았습니다. 로그인이 필요합니다.",
  },
  AUTH_USER_NOT_FOUND: {
    code: "AUTH_USER_NOT_FOUND",
    message: "사용자를 찾을 수 없습니다.",
  },
  AUTH_INVALID_CREDENTIALS: {
    code: "AUTH_INVALID_CREDENTIALS",
    message: "로그인 정보가 일치하지 않습니다.",
  },
  AUTH_PASSWORD_MISMATCH: {
    code: "AUTH_PASSWORD_MISMATCH",
    message: "비밀번호가 일치하지 않습니다.",
  },
  AUTH_DUPLICATE_USER: {
    code: "AUTH_DUPLICATE_USER",
    message: "이미 가입된 사용자입니다.",
  },
  SESSION_EXPIRED: {
    code: "SESSION_EXPIRED",
    message: "세션이 만료되었습니다.",
  },

  // Token Errors
  TOKEN_INVALID: {
    code: "TOKEN_INVALID",
    message: "유효하지 않은 토큰입니다.",
  },
  TOKEN_EXPIRED: {
    code: "TOKEN_EXPIRED",
    message: "인증 토큰이 만료되었습니다.",
  },
  TOKEN_MISSING: {
    code: "TOKEN_MISSING",
    message: "인증 토큰이 없습니다.",
  },
  TOKEN_GENERATION_FAILED: {
    code: "TOKEN_GENERATION_FAILED",
    message: "토큰 생성에 실패했습니다.",
  },

  TOKEN_EMPTY_EXPIRES: {
    code: "TOKEN_EMPTY_EXPIRES",
    message: "토큰의 유효기간 정보가 없습니다.",
  },

  // Validation Errors
  VALIDATION_INVALID_INPUT: {
    code: "VALIDATION_INVALID_INPUT",
    message: "입력값이 올바르지 않습니다.",
  },
  VALIDATION_REQUIRED_FIELD_MISSING: {
    code: "VALIDATION_REQUIRED_FIELD_MISSING",
    message: "필수 입력 항목이 누락되었습니다.",
  },
  VALIDATION_FORMAT_ERROR: {
    code: "VALIDATION_FORMAT_ERROR",
    message: "잘못된 형식의 데이터입니다.",
  },

  // Resource Errors
  REQUEST_INVALID: {
    code: "REQUEST_INVALID",
    message: "잘못된 요청입니다.",
  },
  RESOURCE_NOT_FOUND: {
    code: "RESOURCE_NOT_FOUND",
    message: "요청한 리소스를 찾을 수 없습니다.",
  },
  RESOURCE_ALREADY_EXISTS: {
    code: "RESOURCE_ALREADY_EXISTS",
    message: "이미 존재하는 리소스입니다.",
  },

  // Question Related Errors

  QUESTION_NOT_AVAILABLE: {
    code: "QUESTION_NOT_AVAILABLE",
    message: "현재 이용 가능한 질문이 없습니다.",
  },
  QUESTION_NOT_FOUND: {
    code: "QUESTION_NOT_FOUND",
    message: "질문을 찾을 수 없습니다.",
  },
  QUESTION_DUPLICATE: {
    code: "QUESTION_DUPLICATE",
    message: "중복된 질문이 존재합니다.",
  },

  // Answer Related Errors
  ANSWER_GENERATION_FAILED: {
    code: "ANSWER_GENERATION_FAILED",
    message: "답변 생성에 실패했습니다.",
  },

  // Server Errors
  SERVER_INTERNAL_ERROR: {
    code: "SERVER_INTERNAL_ERROR",
    message: "서버 내부 오류가 발생했습니다.",
  },

  // Generic Errors
  ERROR_UNKNOWN: {
    code: "ERROR_UNKNOWN",
    message: "알 수 없는 오류가 발생했습니다.",
  },
  ERROR_UNEXPECTED: {
    code: "ERROR_UNEXPECTED",
    message: "예상치 못한 오류가 발생했습니다.",
  },
} as const

// 에러 코드 타입
export type ErrorCode = keyof typeof ErrorCodeMap

// 에러 메시지 객체 생성
export const ERROR_MESSAGES = Object.fromEntries(
  Object.entries(ErrorCodeMap).map(([, { message }]) => [, message])
) as Record<ErrorCode, string>
