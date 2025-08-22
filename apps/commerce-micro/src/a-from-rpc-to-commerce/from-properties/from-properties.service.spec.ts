import { Test, TestingModule } from '@nestjs/testing';
import { FromPropertiesService } from './from-properties.service';

describe('FromPropertiesService', () => {
  let service: FromPropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FromPropertiesService],
    }).compile();

    service = module.get<FromPropertiesService>(FromPropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
