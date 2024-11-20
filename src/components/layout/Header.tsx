import Link from "next/link"
// constants
import { PATHS } from "@/constants/paths"
// lib
import { auth } from "@/lib/auth"
// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Heading } from "@/components/ui/typography/Heading"

/**
 * 헤더 컴포넌트
 */
export default async function Header() {
  const session = await auth()

  const user = session?.user
  const name = user?.name || user?.email || "Guest"
  const image = user?.image || process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE

  return (
    <header>
      <div className="flex items-center justify-between max-w-[960px] h-[60px] px-4 mx-auto">
        {/* 로고 */}
        <Link href={PATHS.MAIN}>
          <Heading level="h1" size="sm">
            Daily Story
          </Heading>
        </Link>

        {/* 네비게이션 */}
        {user && (
          <nav>
            <ul>
              <li>
                <Link href={PATHS.PROFILE}>
                  <Avatar>
                    <AvatarImage src={image} alt={`${name} 프로필 이미지`} />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
