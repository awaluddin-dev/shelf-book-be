const fs = require('fs');
let code = fs.readFileSync('prisma/seed.ts', 'utf8');

// Metrics
code = code.replace(/await prisma\.metric\.deleteMany\(\{\}\);\s*await prisma\.metric\.createMany\(\{\s*data: \[([\s\S]*?)\]\s*\}\);/m, (match, data) => {
  return `// Metrics Upsert
  const metrics = [${data}];
  for (const m of metrics) {
    await prisma.metric.upsert({ where: { id: m.id }, update: m, create: m });
  }`;
});

// Skills
code = code.replace(/await prisma\.skill\.deleteMany\(\{\}\);\s*for \(const node of defaultSkillNodes\) \{\s*await prisma\.skill\.create\(\{\s*data: \{\s*id: node\.id,([^]*?)\}\s*\}\);\s*\}/m, (match, data) => {
  return `for (const node of defaultSkillNodes) {
    await prisma.skill.upsert({
      where: { id: node.id },
      update: node,
      create: node
    });
  }`;
});

// Experiences
code = code.replace(/await prisma\.workExperience\.deleteMany\(\{\}\);\s*for \(const exp of experiencesList\) \{\s*await prisma\.workExperience\.create\(\{\s*data: ([\s\S]*?)\s*\}\);\s*\}/m, () => {
  return `for (const exp of experiencesList) {
    const id = 'exp-' + exp.company.toLowerCase().replace(/\\W+/g, '-');
    await prisma.workExperience.upsert({
      where: { id },
      update: { ...exp },
      create: { id, ...exp }
    });
  }`;
});

// Proficiencies
code = code.replace(/await prisma\.proficiencySkill\.deleteMany\(\{\}\);\s*await prisma\.proficiency\.deleteMany\(\{\}\);\s*for \(const cat of skillCategoriesList\) \{\s*await prisma\.proficiency\.create\(\{\s*data: ([\s\S]*?)\s*\}\);\s*\}/m, () => {
  return `// Clear child skills only for seeded proficiencies
  const seededProfIds = skillCategoriesList.map(c => 'prof-' + c.title.toLowerCase().replace(/\\W+/g, '-'));
  await prisma.proficiencySkill.deleteMany({ where: { proficiencyId: { in: seededProfIds } } });
  
  for (const cat of skillCategoriesList) {
    const id = 'prof-' + cat.title.toLowerCase().replace(/\\W+/g, '-');
    const data = { title: cat.title };
    await prisma.proficiency.upsert({
      where: { id },
      update: data,
      create: { id, ...data }
    });
    
    // Create skills for this proficiency
    if (cat.skills) {
      await prisma.proficiencySkill.createMany({
        data: cat.skills.map(s => ({
          proficiencyId: id,
          name: s.name,
          subtext: s.subtext,
          status: s.status
        }))
      });
    }
  }`;
});

// Projects
code = code.replace(/await prisma\.project\.deleteMany\(\{\}\);\s*for \(const proj of projects\) \{\s*await prisma\.project\.create\(\{\s*data: ([\s\S]*?)\s*\}\);\s*\}/m, () => {
  return `for (const proj of projects) {
    const data = {
        title: proj.title,
        subtitle: proj.subtitle,
        category: proj.category,
        date: proj.date,
        tags: proj.tags,
        spineColor: proj.spineColor,
        coverColor: proj.coverColor,
        spineText: proj.spineText,
        github: proj.github || null,
        demoUrl: proj.demoUrl || null,
        stats: proj.stats || null,
        phases: proj.phases || null,
        markdown: proj.markdown || '',
        reasonToBuild: (proj).reasonToBuild || null,
        problemSolved: (proj).problemSolved || null,
    };
    await prisma.project.upsert({
      where: { id: proj.id },
      update: data,
      create: { id: proj.id, ...data }
    });
  }`;
});

// Current Focus
code = code.replace(/await prisma\.currentFocus\.deleteMany\(\{\}\);\s*for \(const focus of currentFocusData\) \{\s*await prisma\.currentFocus\.create\(\{\s*data: ([\s\S]*?)\s*\}\);\s*\}/m, () => {
  return `for (const focus of currentFocusData) {
    const id = 'focus-' + focus.title.toLowerCase().replace(/\\W+/g, '-');
    await prisma.currentFocus.upsert({
      where: { id },
      update: { ...focus },
      create: { id, ...focus }
    });
  }`;
});

// Roadmap
code = code.replace(/await prisma\.roadmap\.deleteMany\(\{\}\);\s*for \(const item of roadmapItemsData\) \{\s*await prisma\.roadmap\.create\(\{\s*data: ([\s\S]*?)\s*\}\);\s*\}/m, () => {
  return `for (const item of roadmapItemsData) {
    const id = 'rm-' + item.tech.toLowerCase().replace(/\\W+/g, '-');
    await prisma.roadmap.upsert({
      where: { id },
      update: { ...item },
      create: { id, ...item }
    });
  }`;
});

// Child items (Visual Showcase, System Architecture, Project Lifecycle)
// Since they belong to projects, we delete only those matching seeded projects.
code = code.replace(/await prisma\.visualShowcase\.deleteMany\(\{\}\);/, "await prisma.visualShowcase.deleteMany({ where: { projectId: { in: projects.map(p => p.id) } } });");
code = code.replace(/await prisma\.systemArchitecture\.deleteMany\(\{\}\);/, "await prisma.systemArchitecture.deleteMany({ where: { projectId: { in: projects.map(p => p.id) } } });");
code = code.replace(/await prisma\.projectLifecycle\.deleteMany\(\{\}\);/, "await prisma.projectLifecycle.deleteMany({ where: { projectId: { in: projects.map(p => p.id) } } });");

fs.writeFileSync('prisma/seed.ts', code);
console.log('Done refactoring seed.ts');
