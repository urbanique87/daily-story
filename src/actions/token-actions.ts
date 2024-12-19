// services
import { issueTokenPair, reissueAccessToken } from "@/services/token-service"
// types
import { ApiResponse } from "@/types/response.types"
import { TokenPayload, Tokens } from "@/types/token.types"
// utils
import { handleActionError } from "@/utils/errors/action-error-handler"

// ----------------------------------------------------------------------

export async function generateToken({
  id,
  email,
}: Omit<TokenPayload, "type">): Promise<ApiResponse<Tokens>> {
  try {
    const tokens = await issueTokenPair({ id, email })
    return {
      success: true,
      data: {
        ...tokens,
      },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

// ----------------------------------------------------------------------

export async function renewAccessToken({
  refreshToken,
}: {
  refreshToken: string
}): Promise<ApiResponse<Tokens>> {
  try {
    const tokens = await reissueAccessToken({ refreshToken })
    return {
      success: true,
      data: {
        ...tokens,
      },
    }
  } catch (error) {
    return handleActionError(error)
  }
}
