import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HeroConfigDto, MetricDto } from './hero.dto';

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------------------------------
  // STATUS
  // ----------------------------------------------------

  async getStatus(): Promise<string> {
    const statusObj = await this.prisma.portfolioStatus.findUnique({
      where: { id: 'status_1' },
    });
    return statusObj ? statusObj.status : 'busy';
  }

  async updateStatus(status: string) {
    await this.prisma.portfolioStatus.upsert({
      where: { id: 'status_1' },
      update: { status },
      create: { id: 'status_1', status },
    });
    return { success: true, status };
  }

  // ----------------------------------------------------
  // HERO — HeroConfig + Metrics
  // ----------------------------------------------------

  async getHero() {
    const heroConfig =
      (await this.prisma.heroConfig.findUnique({
        where: { id: 'hero_1' },
      })) || {};

    const metrics = await this.prisma.metric.findMany();

    return { heroConfig, metrics };
  }

  async updateHero(
    heroConfigPayload?: Partial<HeroConfigDto>,
    metricsPayload?: MetricDto[],
  ) {
    if (heroConfigPayload) {
      await this.prisma.heroConfig.upsert({
        where: { id: 'hero_1' },
        update: heroConfigPayload,
        create: { id: 'hero_1', ...heroConfigPayload },
      });
    }

    if (metricsPayload) {
      await this.prisma.metric.deleteMany();
      if (metricsPayload.length > 0) {
        await this.prisma.metric.createMany({
          data: metricsPayload,
        });
      }
    }

    return { success: true };
  }
}
