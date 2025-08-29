import { Test, TestingModule } from '@nestjs/testing';
import { HoneypotService } from './honeypot.service';

describe('HoneypotService', () => {
  let service: HoneypotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoneypotService],
    }).compile();

    service = module.get<HoneypotService>(HoneypotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
