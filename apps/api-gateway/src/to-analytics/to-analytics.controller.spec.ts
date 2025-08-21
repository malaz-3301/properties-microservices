import { Test, TestingModule } from '@nestjs/testing';
import { ToAnalyticsController } from './to-analytics.controller';

describe('ToAnalyticsController', () => {
  let controller: ToAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToAnalyticsController],
    }).compile();

    controller = module.get<ToAnalyticsController>(ToAnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
