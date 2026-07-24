import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import * as fs from 'fs';

jest.mock('fs');
jest.mock('@prisma/adapter-pg', () => {
  return {
    PrismaPg: jest.fn().mockImplementation(() => ({})),
  };
});
jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => ({
      end: jest.fn(),
    })),
  };
});

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: class {
      $connect = jest.fn();
      $disconnect = jest.fn();
    },
  };
});

describe('PrismaService', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should initialize without SSL if DB_REQUIRE_SSL is not true', async () => {
    process.env.DB_REQUIRE_SSL = 'false';
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    const service = module.get<PrismaService>(PrismaService);
    expect(service).toBeDefined();
  });

  it('should initialize with DATABASE_CA', async () => {
    process.env.DB_REQUIRE_SSL = 'true';
    process.env.DATABASE_CA = Buffer.from('test-ca').toString('base64');

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    const service = module.get<PrismaService>(PrismaService);
    expect(service).toBeDefined();
  });

  it('should initialize with CA_CERT_PATH', async () => {
    process.env.DB_REQUIRE_SSL = 'true';
    delete process.env.DATABASE_CA;
    process.env.CA_CERT_PATH = 'fake-path.pem';

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('test-ca-content');

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    const service = module.get<PrismaService>(PrismaService);
    expect(service).toBeDefined();
  });

  it('should throw error if CA_CERT_PATH file not found', async () => {
    process.env.DB_REQUIRE_SSL = 'true';
    delete process.env.DATABASE_CA;
    process.env.CA_CERT_PATH = 'fake-path.pem';

    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(() => {
      new PrismaService();
    }).toThrow();
  });

  it('should initialize with SSL rejectUnauthorized false if no CA provided', async () => {
    process.env.DB_REQUIRE_SSL = 'true';
    delete process.env.DATABASE_CA;
    delete process.env.CA_CERT_PATH;

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    const service = module.get<PrismaService>(PrismaService);
    expect(service).toBeDefined();
  });

  describe('Lifecycle hooks', () => {
    let service: PrismaService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [PrismaService],
      }).compile();
      service = module.get<PrismaService>(PrismaService);
    });

    it('should connect onModuleInit', async () => {
      await service.onModuleInit();
      expect(service.$connect).toHaveBeenCalled();
    });

    it('should disconnect onModuleDestroy', async () => {
      await service.onModuleDestroy();
      expect(service.$disconnect).toHaveBeenCalled();
      expect(service['pool'].end).toHaveBeenCalled();
    });
  });
});
