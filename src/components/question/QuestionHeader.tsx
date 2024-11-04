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
    <header role="banner">
      <div>Hi</div>
      <div>{defaultUser.nickname}</div>
      <Link href={PATHS.PROFILE}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={defaultUser.profileImage} alt={`${defaultUser.nickname} profile`} />
      </Link>
      <div>{getTimeBasedGreeting()}</div>
    </header>
  )
}
