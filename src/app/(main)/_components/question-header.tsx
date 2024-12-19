import type { Session } from "next-auth"
// libs
import { getTimeBasedGreeting } from "@/lib/getTimeBasedGreeting"
// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"

/**
 * 질문 페이지 헤더
 */
export default function QuestionHeader({ session }: { session: Session }) {
  const user = session.user
  const userName = user.name || "Guest"
  const userInitial = user.name || user.email || "Guest"
  const profileImage = user.image || process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE

  return (
    <header
      role="banner"
      className="flex justify-between items-center h-20"
      data-testid="question-header"
    >
      <div className="flex gap-4">
        <Avatar className="w-[50px] h-[50px]">
          <AvatarImage src={profileImage} alt={`${userName} profile`} />
          <AvatarFallback>{userInitial[0]}</AvatarFallback>
        </Avatar>

        <section className="flex flex-col">
          <div className="text-xs">
            <span className="mr-1">Hi!</span>
            <span>{userName}</span>
          </div>
          <p className="text-lg font-medium">{getTimeBasedGreeting()}</p>
        </section>
      </div>
    </header>
  )
}
