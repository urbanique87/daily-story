export enum ErrorCode {
  // AuthErrorCode
  UNAUTHORIZED = "UNAUTHORIZED",
  WRONG_PASSWORD = "WRONG_PASSWORD",

  // GeneralErrorCode
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  INVALID_REQUEST = "INVALID_REQUEST",

  // QuestionErrorCode
  NO_QUESTION_TODAY = "NO_QUESTION_TODAY",
  ALL_QUESTIONS_DISTRIBUTED = "ALL_QUESTIONS_DISTRIBUTED",
  DUPLICATE_QUESTION = "DUPLICATE_QUESTION",
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public statusCode: number,
    public message: string = "An error occurred"
  ) {
    super(message)
    this.name = this.constructor.name
  }

  public toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    }
  }
}
