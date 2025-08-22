import { Test, TestingModule } from '@nestjs/testing';
import { ProGeoController } from './pro-geo.controller';
import { ProGeoService } from './pro-geo.service';

describe('ProGeoController', () => {
  let controller: ProGeoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProGeoController],
      providers: [ProGeoService],
    }).compile();

    controller = module.get<ProGeoController>(ProGeoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
