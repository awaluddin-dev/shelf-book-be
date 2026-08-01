const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  const skills = await prisma.skill.findMany({ select: { id: true, title: true, x: true, y: true } })
  console.log(skills)
}
main().catch(console.error).finally(() => prisma.$disconnect())
