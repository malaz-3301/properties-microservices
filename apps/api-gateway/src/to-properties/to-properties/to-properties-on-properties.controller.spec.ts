import { Test, TestingModule } from '@nestjs/testing';
import { ToPropertiesOnPropertiesController } from './to-properties-on-properties.controller';

describe('ToPropertiesOnPropertiesController', () => {
  let controller: ToPropertiesOnPropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToPropertiesOnPropertiesController],
    }).compile();

    controller = module.get<ToPropertiesOnPropertiesController>(ToPropertiesOnPropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
