import { ErrorCode } from "@/types/error.types"

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  error?: ErrorCode
}
