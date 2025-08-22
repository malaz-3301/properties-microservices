import { Test, TestingModule } from '@nestjs/testing';
import { ToPropertiesAdPropertiesController } from './to-properties-ad-properties.controller';

describe('ToPropertiesAdPropertiesController', () => {
  let controller: ToPropertiesAdPropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToPropertiesAdPropertiesController],
    }).compile();

    controller = module.get<ToPropertiesAdPropertiesController>(ToPropertiesAdPropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
