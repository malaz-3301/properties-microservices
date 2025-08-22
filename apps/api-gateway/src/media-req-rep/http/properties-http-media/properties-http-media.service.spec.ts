import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesHttpMediaService } from './properties-http-media.service';

describe('PropertiesHttpMediaService', () => {
  let service: PropertiesHttpMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertiesHttpMediaService],
    }).compile();

    service = module.get<PropertiesHttpMediaService>(PropertiesHttpMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
