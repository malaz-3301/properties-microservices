import { Test, TestingModule } from '@nestjs/testing';
import { ProGeoService } from './pro-geo.service';

describe('ProGeoService', () => {
  let service: ProGeoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProGeoService],
    }).compile();

    service = module.get<ProGeoService>(ProGeoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
