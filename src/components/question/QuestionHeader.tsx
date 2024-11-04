import Link from "next/link"
// constants
import { GREETINGS } from "@/constants/greetings"
// types
import { DefaultUser } from "@/types/user"

interface QuestionHeaderProps {
  defaultUser: DefaultUser
}

/**
 * 질문 페이지 헤더
 */

export default function QuestionHeader({ defaultUser }: QuestionHeaderProps) {
  const getGreeting = () => {
    const localTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Seoul",
    })

    const hours = new Date(localTime).getHours()
    if (hours >= 5 && hours < 12) {
      return GREETINGS.MORNING
    }

    if (hours >= 12 && hours < 17) {
      return GREETINGS.AFTERNOON
    }

    if (hours >= 17 && hours < 21) {
      return GREETINGS.EVENING
    }

    return GREETINGS.NIGHT
  }

  return (
    <header role="banner">
      <div>Hi</div>
      <div>{defaultUser.nickname}</div>
      <Link href="/profile">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={defaultUser.profileImage} alt={`${defaultUser.nickname} profile`} />
      </Link>
      <div>{getGreeting()}</div>
    </header>
  )
}
