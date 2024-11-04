import Link from "next/link"

interface DefaultUser {
  profileImage: string
  nickname: string
}

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
      return "good morning" // 오전 5시 ~ 12시
    }

    if (hours >= 12 && hours < 17) {
      return "good afternoon" // 오후 12시 ~ 5시
    }

    if (hours >= 17 && hours < 21) {
      return "good evening" // 오후 5시 ~ 9시
    }

    return "good night" // 오후 9시 이후
  }

  return (
    <header role="banner">
      <div>Hi</div>
      <div>{defaultUser.nickname}</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Link href="/profile">
        <img src={defaultUser.profileImage} alt={`${defaultUser.nickname} profile`} />
      </Link>
      <div>{getGreeting()}</div>
    </header>
  )
}
