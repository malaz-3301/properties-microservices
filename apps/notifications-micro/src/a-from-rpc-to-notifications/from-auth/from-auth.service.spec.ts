import { Test, TestingModule } from '@nestjs/testing';
import { FromAuthService } from './from-auth.service';

describe('FromAuthService', () => {
  let service: FromAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FromAuthService],
    }).compile();

    service = module.get<FromAuthService>(FromAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
