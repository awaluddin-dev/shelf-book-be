import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.testimonial.updateMany({
    where: { status: 'pending' },
    data: { status: 'accepted' },
  });
  console.log('Testimonials updated to accepted');
}

main().catch(console.error).finally(() => prisma.$disconnect());
