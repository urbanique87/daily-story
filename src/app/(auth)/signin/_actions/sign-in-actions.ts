"use server"

import { revalidatePath } from "next/cache"
// lib
import { signIn } from "@/lib/auth"
import { PATHS } from "@/constants/paths"
// utils
import { handleActionError } from "@/utils/errors/action-error-handler"
// types
import { ApiResponse } from "@/types/response.types"
import { Credentials } from "@/types/auth.types"

export async function signin({
  email,
  password,
}: Credentials): Promise<ApiResponse<null>> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    // 페이지 데이터 갱신
    revalidatePath(PATHS.SIGNIN)

    return { success: true, data: null }
  } catch (error) {
    return handleActionError(error)
  }
}
