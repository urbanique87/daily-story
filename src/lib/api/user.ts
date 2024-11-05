// types
import { DefaultUser } from "@/types/user"

export async function getUser() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
    // next: { revalidate: 3600 } // 선택적 ISR
    // cache: "force-cache", // 기본값 - SSR & 캐싱
    // cache: "no-store", // 실시간 데이터가 필요한 경우
  })

  if (response.ok === false) {
    throw new Error("Failed to fetch user")
  }

  const data: DefaultUser = await response.json()
  return data
}
