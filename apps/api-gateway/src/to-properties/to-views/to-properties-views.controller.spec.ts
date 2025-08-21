import { Test, TestingModule } from '@nestjs/testing';
import { ToPropertiesViewsController } from './to-properties-views.controller';

describe('ToPropertiesViewsController', () => {
  let controller: ToPropertiesViewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToPropertiesViewsController],
    }).compile();

    controller = module.get<ToPropertiesViewsController>(ToPropertiesViewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
