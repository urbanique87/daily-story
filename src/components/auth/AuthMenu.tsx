import { PATHS } from "@/constants/paths"
// components
import { Heading } from "@/components/ui/typography/Heading"
import { Text } from "@/components/ui/typography/Text"
import { TextLink } from "@/components/ui/link/TextLink"

/**
 * 회원가입, 로그인 메뉴 컴포넌트
 */
export default function AuthMenu() {
  return (
    <div
      className="flex justify-center pt-[150px] pb-[50px] md:pt-[250px] md:pb-[100px] transition-all duration-500 ease-in-out"
      data-testid="auth-menu"
    >
      <div className="text-center">
        <div className="text-4xl mb-2">✍️</div>

        <Heading level="h1" size="lg" className="mb-4">
          Daily Story
        </Heading>

        <Text variant="body" size="sm" className="mb-4">
          매일 새로운 질문으로 이야기를 기록해보세요.
        </Text>

        <div className="flex flex-col">
          <TextLink
            variant="body"
            size="md"
            buttonStyle="primary"
            className="mb-2"
            href={PATHS.SIGNUP}
          >
            회원가입
          </TextLink>

          <TextLink variant="body" size="md" href={PATHS.SIGNIN}>
            로그인
          </TextLink>
        </div>
      </div>
    </div>
  )
}
