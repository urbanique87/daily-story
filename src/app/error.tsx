"use client"

import { useEffect } from "react"
// constants
import { ErrorCodeMap } from "@/constants/error"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Error:", error)
  }, [error])

  return (
    <main className="flex flex-col items-center justify-center h-dvh">
      <h2 className="text-center">
        {error.message === ErrorCodeMap.AUTH_UNAUTHORIZED.code
          ? "로그인이 필요합니다"
          : "문제가 발생했습니다"}
      </h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  )
}
