import Link from "next/link"
// libs
import { getTimeBasedGreeting } from "@/lib/getTimeBasedGreeting"
// constants
import { PATHS } from "@/constants/paths"
// api
import { getUser } from "@/lib/api/user"

/**
 * 질문 페이지 헤더
 */
export default async function QuestionHeader() {
  const defaultUser = await getUser()

  return (
    <header role="banner" className="flex justify-between items-center h-20 px-5">
      <section className="flex flex-col">
        <div className="text-xs">
          <span className="mr-1">Hi!</span>
          <span>{defaultUser.nickname}</span>
        </div>
        <p className="text-lg font-medium">{getTimeBasedGreeting()}</p>
      </section>

      <Link
        className="w-12 h-12 rounded-full overflow-hidden"
        aria-label={`${defaultUser.nickname}의 프로필로 이동`}
        href={PATHS.PROFILE}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover"
          src={defaultUser.profileImage}
          alt={`${defaultUser.nickname} profile`}
        />
      </Link>
    </header>
  )
}

export function QuestionHeaderSkeleton() {
  return (
    <header className="flex justify-between items-center h-20 px-5">
      <section className="flex flex-col gap-1">
        <div className="text-xs">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        <div className="text-lg font-medium">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </section>

      <div className="w-12 h-12 rounded-full overflow-hidden">
        <div className="w-full h-full bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </header>
  )
}
