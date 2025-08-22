import { Test, TestingModule } from '@nestjs/testing';
import { FromReportsService } from './from-reports.service';

describe('FromReportsService', () => {
  let service: FromReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FromReportsService],
    }).compile();

    service = module.get<FromReportsService>(FromReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
