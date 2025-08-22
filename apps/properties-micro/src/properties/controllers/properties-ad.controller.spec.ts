import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesAdController } from './properties-ad.controller';

describe('PropertiesAdController', () => {
  let controller: PropertiesAdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesAdController],
    }).compile();

    controller = module.get<PropertiesAdController>(PropertiesAdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
