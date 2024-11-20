"use client"

import { useRouter } from "next/navigation"
// constants
import { PATHS } from "@/constants/paths"

export default function BackNavigationHeader() {
  const router = useRouter()

  const handleBackClick = () => {
    const referrer = document.referrer

    // referrer가 없으면 직접 접근
    const isDirectAccess = !referrer

    // 외부 사이트에서 왔는지
    const isExternalReferrer =
      referrer && new URL(referrer).hostname !== window.location.hostname

    const isHistoryEmpty = window.history.length <= 1

    if (isHistoryEmpty || isDirectAccess || isExternalReferrer) {
      router.push(PATHS.MAIN)
    } else {
      router.back()
    }
  }

  return (
    <header className="border-b">
      <nav className="flex max-w-[600px] h-12 px-5 mx-auto items-center">
        <button
          type="button"
          onClick={handleBackClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로 가기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </nav>
    </header>
  )
}
