import fs from "fs/promises"
import path from "path"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface Question {
  id: number
  question: string
  category: string
}

/**
 * 질문과 카테고리를 테이블에 삽입하는 사전 작업
 */
async function main() {
  const filePath = path.join(process.cwd(), "src", "data", "questions.json")
  const fileData = await fs.readFile(filePath, "utf-8")
  const questions: Question[] = JSON.parse(fileData)

  if (
    !Array.isArray(questions) ||
    questions.some((q) => !q.category || !q.question)
  ) {
    throw new Error("Invalid data format in questions.json")
  }

  // 중복이 제거된 카테고리 추출
  const categories = [
    ...new Set(questions.map(({ category }) => category)),
  ].map((name) => ({ name }))

  await prisma.$transaction(async (prisma) => {
    // 카테고리 생성
    await prisma.category.createMany({
      data: categories,
    })

    // 카테고리 매핑
    const createdCategories = await prisma.category.findMany({})
    const categoryMap = createdCategories.reduce<Record<string, number>>(
      (map, category) => {
        map[category.name] = category.id
        return map
      },
      {}
    )

    // 질문 데이터 생성
    const questionData = questions.map((item) => ({
      text: item.question,
      categoryId: categoryMap[item.category],
    }))

    // 질문 데이터 삽입
    await prisma.questionTemplate.createMany({
      data: questionData,
    })
  })

  console.log("질문 데이터가 성공적으로 데이터베이스에 로드되었습니다.")
}

main()
  .catch((error) => {
    console.error("Error: ", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
