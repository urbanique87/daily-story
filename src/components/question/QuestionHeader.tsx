import Link from "next/link"
// types
import { DefaultUser } from "@/types/user"
// libs
import { getTimeBasedGreeting } from "@/lib/getTimeBasedGreeting"
// constants
import { PATHS } from "@/constants/paths"

interface QuestionHeaderProps {
  defaultUser: DefaultUser
}

/**
 * 질문 페이지 헤더
 */
export default function QuestionHeader({ defaultUser }: QuestionHeaderProps) {
  return (
    <header role="banner" className="flex justify-between items-center h-20 px-5">
      <section className="flex flex-col">
        <div className="text-xs">
          <span className="mr-1">Hi!</span>
          <span>{defaultUser.nickname}</span>
        </div>
        <p className="text-lg font-medium">{getTimeBasedGreeting()}</p>
      </section>

      <Link href={PATHS.PROFILE} className="w-12 h-12 rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={defaultUser.profileImage}
          alt={`${defaultUser.nickname} profile`}
        />
      </Link>
    </header>
  )
}
