// constatns
import { ErrorCodeMap } from "@/constants/error"
// utils
import { AppError } from "@/utils/errors/custom.error"

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
      throw new AppError(ErrorCodeMap.REQUEST_INVALID.code)
    }

    const { data } = await response.json()
    return data as T
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError(
          ErrorCodeMap.SERVER_INTERNAL_ERROR.code,
          error instanceof Error
            ? error.message
            : "예상치 못한 오류가 발생했습니다."
        )
  }
}
