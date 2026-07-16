import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.testimonial.updateMany({
    data: { status: 'accepted' },
  });
  console.log('Updated:', result.count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
