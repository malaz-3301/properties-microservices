import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesAgController } from './properties-ag.controller';

describe('PropertiesAgController', () => {
  let controller: PropertiesAgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesAgController],
    }).compile();

    controller = module.get<PropertiesAgController>(PropertiesAgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
