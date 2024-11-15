import Link from "next/link"
// libs
import { getTimeBasedGreeting } from "@/lib/getTimeBasedGreeting"
// constants
import { PATHS } from "@/constants/paths"
// type
import type { Session } from "next-auth"

interface QuestionHeaderProps {
  session: Session
}

/**
 * 질문 페이지 헤더
 */
export default function QuestionHeader({ session }: QuestionHeaderProps) {
  const name = session.user.name || "Guest"
  const image = session.user.image || process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE

  return (
    <header
      role="banner"
      className="flex justify-between items-center h-20 px-5"
    >
      <section className="flex flex-col">
        <div className="text-xs">
          <span className="mr-1">Hi!</span>
          <span>{name}</span>
        </div>
        <p className="text-lg font-medium">{getTimeBasedGreeting()}</p>
      </section>

      <Link
        className="w-12 h-12 rounded-full overflow-hidden"
        aria-label={`${name}의 프로필로 이동`}
        href={PATHS.PROFILE}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover"
          src={image}
          alt={`${name} profile`}
        />
      </Link>
    </header>
  )
}
