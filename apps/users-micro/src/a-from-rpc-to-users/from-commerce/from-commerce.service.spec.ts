import { Test, TestingModule } from '@nestjs/testing';
import { FromCommerceService } from './from-commerce.service';

describe('FromCommerceService', () => {
  let service: FromCommerceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FromCommerceService],
    }).compile();

    service = module.get<FromCommerceService>(FromCommerceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
