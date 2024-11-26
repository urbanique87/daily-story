"use client"

import { useEffect } from "react"
// import { AppError } from "@/utils/errors/error.code"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // 개발 환경에서만 에러 로깅
    if (process.env.NODE_ENV === "development") {
      console.error("Error:", error)
    }
  }, [error])

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-lg font-semibold mb-4">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">
            {/* {error instanceof AppError
              ? error.message
              : "일시적인 오류가 발생했습니다"} */}
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  )
}
