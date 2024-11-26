// constants
import { ErrorCode, ErrorCodeMap } from "@/constants/error"

export class AppError extends Error {
  code: ErrorCode

  constructor(code: ErrorCode, message?: string) {
    const errorMessage = message
      ? message
      : ErrorCodeMap[code].message || "알 수 없는 오류가 발생했습니다."

    super(errorMessage)
    this.name = this.constructor.name
    this.code = code
    // this.stack = undefined

    // Error.captureStackTrace(this, this.constructor)
  }
}
