import bcrypt from "bcrypt"

// lib
import { prisma } from "@/lib/prisma"

/**
 * 이메일과 비밀번호로 사용자를 인증하는 함수
 */
export const getUserFromDb = async (email: string, password: string) => {
  // Prisma를 사용하여 사용자의 이메일로 DB에서 사용자 조회
  const foundUser = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  // 사용자 없으면 null 반환
  if (!foundUser) {
    return null
  }

  // 비밀번호가 일치하는지 확인
  const isValidPassword = await bcrypt.compare(password, foundUser.password)

  // 비밀번호가 일치하지 않으면 null 반환
  if (!isValidPassword) {
    return null
  }

  return {
    id: foundUser.id.toString(),
    name: foundUser.name,
    email: foundUser.email,
    image: foundUser.image,
  }
}
