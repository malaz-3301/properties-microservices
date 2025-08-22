import { Test, TestingModule } from '@nestjs/testing';
import { UserGeoService } from './user-geo.service';

describe('UserGeoService', () => {
  let service: UserGeoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserGeoService],
    }).compile();

    service = module.get<UserGeoService>(UserGeoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
