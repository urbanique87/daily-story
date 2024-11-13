"use client"

import { useRouter } from "next/navigation"

export default function Profile() {
  const router = useRouter()
  function back() {
    router.back()
  }

  return (
    <button type="button" onClick={back}>
      뒤뒤
    </button>
  )
}
