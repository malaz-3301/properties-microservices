import { Test, TestingModule } from '@nestjs/testing';
import { FromAnalyticsController } from './from-analytics.controller';

describe('FromAnalyticsController', () => {
  let controller: FromAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromAnalyticsController],
    }).compile();

    controller = module.get<FromAnalyticsController>(FromAnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
