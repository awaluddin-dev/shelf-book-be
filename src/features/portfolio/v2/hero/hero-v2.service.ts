import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HeroConfigV2Dto, MetricV2Dto } from './hero-v2.dto';

@Injectable()
export class HeroV2Service {
  constructor(private prisma: PrismaService) {}

  async getHero() {
    let heroConfig = await this.prisma.heroConfigV2.findUnique({
      where: { id: 'hero_v2_default' },
    });

    if (!heroConfig) {
      heroConfig = await this.prisma.heroConfigV2.create({
        data: {
          id: 'hero_v2_default',
          name: 'Awaluddin',
          role: 'Backend Engineer & AI Integrator',
          headline: 'Production Systems at Scale',
          quote:
            'I ship LLM integrations into production — not train models in notebooks.',
          status: 'available',
          statusText: 'Available for Remote Roles (UTC+7)',
          resumeUrl: '/assets/resume/Awaluddin_cv.pdf',
          docsUrl: 'https://sb.awaluddin.dev/docs',
        },
      });
    }

    const metrics = await this.prisma.metricV2.findMany({
      orderBy: { order: 'asc' },
    });

    return { heroConfig, metrics };
  }

  async updateHero(
    heroConfigPayload?: Partial<HeroConfigV2Dto>,
    metricsPayload?: MetricV2Dto[],
  ) {
    if (heroConfigPayload) {
      const updateData = { ...heroConfigPayload };
      delete updateData.id;
      await this.prisma.heroConfigV2.upsert({
        where: { id: 'hero_v2_default' },
        update: updateData,
        create: {
          id: 'hero_v2_default',
          ...updateData,
        },
      });

      if (updateData.status) {
        await this.prisma.portfolioStatus.upsert({
          where: { id: 'status_1' },
          update: { status: updateData.status },
          create: { id: 'status_1', status: updateData.status },
        });
      }
    }

    if (metricsPayload) {
      await this.prisma.metricV2.deleteMany();
      if (metricsPayload.length > 0) {
        const createData = metricsPayload.map((m, idx) => ({
          value: m.value,
          label: m.label,
          description: m.description,
          subtext: m.subtext,
          icon: m.icon,
          order: m.order !== undefined ? m.order : idx + 1,
        }));
        await this.prisma.metricV2.createMany({
          data: createData,
        });
      }
    }

    return this.getHero();
  }
}
