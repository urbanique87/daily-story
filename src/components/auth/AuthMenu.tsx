import { PATHS } from "@/constants/paths"
import { Heading } from "../ui/typography/Heading"
import { Text } from "../ui/typography/Text"
import { TextLink } from "../ui/link/TextLink"
// import { Button } from "../ui/button/TextButton"

export default function AuthMenu() {
  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="text-center">
        <div className="text-4xl mb-2">✍️</div>

        <Heading level="h1" size="lg" className="mb-4">
          Daily Story
        </Heading>

        <Text variant="body" size="sm" className="mb-4">
          매일 새로운 질문으로 이야기를 기록해보세요.
        </Text>

        <div className="flex flex-col">
          {/* <Button variant="primary" size="md" className="mb-2">
            게스트로 시작
          </Button> */}

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
