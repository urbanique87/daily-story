import Link from "next/link"
// libs
import { getTimeBasedGreeting } from "@/features/question"
// constants
import { PATHS } from "@/shared/constants"
// api
import { getUser } from "@/entities/user"

/**
 * 질문 페이지 헤더
 */
export async function QuestionHeader() {
  const defaultUser = await getUser()

  return (
    <header
      role="banner"
      className="flex justify-between items-center h-20 px-5"
    >
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
