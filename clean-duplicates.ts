import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up old UUID-based duplicates...");

  // WorkExperiences not starting with 'exp-'
  const w = await prisma.workExperience.deleteMany({
    where: { NOT: { id: { startsWith: 'exp-' } } }
  });
  console.log(`Deleted ${w.count} duplicate work experiences.`);

  // Proficiencies not starting with 'prof-'
  const p = await prisma.proficiency.deleteMany({
    where: { NOT: { id: { startsWith: 'prof-' } } }
  });
  console.log(`Deleted ${p.count} duplicate proficiencies.`);

  // CurrentFocus not starting with 'focus-'
  const f = await prisma.currentFocus.deleteMany({
    where: { NOT: { id: { startsWith: 'focus-' } } }
  });
  console.log(`Deleted ${f.count} duplicate current focuses.`);

  // Roadmap not starting with 'rm-'
  const r = await prisma.roadmap.deleteMany({
    where: { NOT: { id: { startsWith: 'rm-' } } }
  });
  console.log(`Deleted ${r.count} duplicate roadmap items.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
