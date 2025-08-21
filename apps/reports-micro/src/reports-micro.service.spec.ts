import { Test, TestingModule } from '@nestjs/testing';
import { ReportsMicroService } from './reports-micro.service';

describe('ReportsMicroService', () => {
  let service: ReportsMicroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsMicroService],
    }).compile();

    service = module.get<ReportsMicroService>(ReportsMicroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
