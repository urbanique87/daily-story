import { PrismaClient } from "@prisma/client"
import fs from "fs/promises"
import path from "path"

const prisma = new PrismaClient()

interface Question {
  id: number
  question: string
  category: string
}

async function main() {
  const filePath = path.join(process.cwd(), "src", "data", "questions.json")
  const fileData = await fs.readFile(filePath, "utf-8")
  const questions: Question[] = JSON.parse(fileData)

  for (const q of questions) {
    await prisma.question.upsert({
      where: { question: q.question },
      update: {},
      create: {
        question: q.question,
        category: q.category,
      },
    })
  }

  console.log("질문 데이터가 성공적으로 데이터베이스에 로드되었습니다.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
