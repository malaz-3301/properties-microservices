import { Test, TestingModule } from '@nestjs/testing';
import { FromAnalyticsService } from './from-analytics.service';

describe('FromAnalyticsService', () => {
  let service: FromAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FromAnalyticsService],
    }).compile();

    service = module.get<FromAnalyticsService>(FromAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
