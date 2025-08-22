import { Test, TestingModule } from '@nestjs/testing';
import { ToPropertiesAgPropertiesController } from './to-properties-ag-properties.controller';

describe('ToPropertiesAgPropertiesController', () => {
  let controller: ToPropertiesAgPropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToPropertiesAgPropertiesController],
    }).compile();

    controller = module.get<ToPropertiesAgPropertiesController>(ToPropertiesAgPropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
