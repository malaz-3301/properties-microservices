import { Test, TestingModule } from '@nestjs/testing';
import { ToPropertiesFavoriteController } from './to-properties-favorite.controller';

describe('ToPropertiesFavoriteController', () => {
  let controller: ToPropertiesFavoriteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToPropertiesFavoriteController],
    }).compile();

    controller = module.get<ToPropertiesFavoriteController>(ToPropertiesFavoriteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
