import bcrypt from "bcrypt"

// 비밀번호 해싱 함수
export const saltAndHashPassword = async (
  password: string
): Promise<string> => {
  const saltRounds = 10 // Salt rounds 설정 (일반적으로 10이 적당)
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

// 비밀번호 검증 함수
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword)
  return isMatch
}
