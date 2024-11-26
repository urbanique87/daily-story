import { AuthError } from "next-auth"
// utils
import { AppError } from "@/utils/errors/custom.error"
// types
import { ApiResponse } from "@/types/response.types"
// constants
import { ErrorCode, ErrorCodeMap } from "@/constants/error"

export function handleActionError(error: unknown): ApiResponse<never> {
  // TODO: 콘솔 로깅 (추후 라이브러리로 대체)
  console.error("Action Error:", error)

  if (error instanceof AuthError) {
    return {
      success: false,
      error: {
        code:
          getErrorCode(error.cause?.type) ?? ErrorCodeMap.ERROR_UNKNOWN.code,
        message: getErrorMessage(error.cause?.message || error.message),
      },
    }
  }

  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    }
  }

  return {
    success: false,
    error: {
      message:
        error instanceof Error
          ? error.message
          : ErrorCodeMap.ERROR_UNEXPECTED.message,
      code: ErrorCodeMap.ERROR_UNKNOWN.code,
    },
  }
}

export function getErrorCode(value: unknown): ErrorCode | undefined {
  return isErrorCode(value) ? value : undefined
}

export function getErrorMessage(value: unknown): string {
  return typeof value === "string" ? value : "알 수 없는 오류가 발생했습니다."
}

export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === "string" && value in ErrorCodeMap
}
