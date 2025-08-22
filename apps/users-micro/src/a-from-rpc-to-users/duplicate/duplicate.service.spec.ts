import { Test, TestingModule } from '@nestjs/testing';
import { DuplicateService } from './duplicate.service';

describe('DuplicateService', () => {
  let service: DuplicateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DuplicateService],
    }).compile();

    service = module.get<DuplicateService>(DuplicateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
