import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesOnController } from './properties-on.controller';

describe('PropertiesOnController', () => {
  let controller: PropertiesOnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesOnController],
    }).compile();

    controller = module.get<PropertiesOnController>(PropertiesOnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
