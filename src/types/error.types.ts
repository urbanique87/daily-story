export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  INVALID_REQUEST = "INVALID_REQUEST",
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
