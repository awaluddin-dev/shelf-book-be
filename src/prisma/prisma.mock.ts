import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from './prisma.service';

export type Context = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = (): Context => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};

export const prismaMockProvider = {
  provide: PrismaService,
  useFactory: () => mockDeep<PrismaClient>(),
};
