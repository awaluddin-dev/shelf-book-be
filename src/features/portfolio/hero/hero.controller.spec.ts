import { Test, TestingModule } from '@nestjs/testing';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';

describe('HeroController', () => {
  let controller: HeroController;
  let heroService: HeroService;

  const mockHeroService = {
    getStatus: jest.fn().mockResolvedValue('available'),
    updateStatus: jest.fn().mockResolvedValue({ success: true, status: 'busy' }),
    getHero: jest.fn().mockResolvedValue({ heroConfig: {}, metrics: [] }),
    updateHero: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeroController],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
      ],
    }).compile();

    controller = module.get<HeroController>(HeroController);
    heroService = module.get<HeroService>(HeroService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return status', async () => {
    const res = await controller.getStatus();
    expect(res).toEqual({ status: 'available' });
    expect(heroService.getStatus).toHaveBeenCalled();
  });

  it('should update status', async () => {
    const res = await controller.updateStatus({ status: 'busy' });
    expect(res).toEqual({ success: true, status: 'busy' });
    expect(heroService.updateStatus).toHaveBeenCalledWith('busy');
  });

  it('should get hero', async () => {
    const res = await controller.getHero();
    expect(res).toEqual({ heroConfig: {}, metrics: [] });
    expect(heroService.getHero).toHaveBeenCalled();
  });

  it('should update hero', async () => {
    const res = await controller.updateHero({ heroConfig: {}, metrics: [] });
    expect(res).toEqual({ success: true });
    expect(heroService.updateHero).toHaveBeenCalledWith({}, []);
  });
});
