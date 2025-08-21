import { Test, TestingModule } from '@nestjs/testing';
import { ToPropertiesPropertiesController } from './to-properties-properties.controller';

describe('ToPropertiesPropertiesController', () => {
  let controller: ToPropertiesPropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToPropertiesPropertiesController],
    }).compile();

    controller = module.get<ToPropertiesPropertiesController>(ToPropertiesPropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
