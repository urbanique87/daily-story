// services
import { validateUserCredentials } from "@/services/auth-service"
// types
import type { Credentials } from "@/types/auth.types"
import type { ApiResponse } from "@/types/response.types"
import type { User } from "@/types/user.types"
// utils
import { handleActionError } from "@/utils/errors/action-error-handler"

// ----------------------------------------------------------------------

/**
 * 사용자 로그인 처리 함수
 */
export async function loginUser({
  email,
  password,
}: Credentials): Promise<ApiResponse<User>> {
  try {
    // 사용자 인증
    const user = await validateUserCredentials({ email, password })

    // 로그인 성공 시 사용자 정보 반환
    return {
      success: true,
      data: user,
    }
  } catch (error) {
    return handleActionError(error)
  }
}
