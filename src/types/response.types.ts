import { ErrorCode } from "@/constants/error"

type SuccessResponse<T> = {
  success: true
  data: T
}

export type ErrorResponse = {
  success: false
  error: {
    code: ErrorCode
    message: string
    // 필요한 경우 추가 정보
    details?: unknown
  }
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
