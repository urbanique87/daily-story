// types
import { AppError, ErrorCode } from "@/types/error.types"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

/**
 * API 요청 함수
 */
export async function request<T>(
  path: string,
  options: RequestInit
): Promise<T> {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    const response = await fetch(`${baseUrl}/${path}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new AppError(
        ErrorCode.INVALID_REQUEST,
        response.status,
        response.statusText
      )
    }

    const data = await response.json()
    return data.data as T
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    if (error instanceof Error) {
      throw new AppError(ErrorCode.INTERNAL_SERVER_ERROR, 500, error.message)
    }

    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
      "Unknown error occurred"
    )
  }
}
