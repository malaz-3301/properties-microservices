import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesRpcMediaService } from './properties-rpc-media.service';

describe('PropertiesRpcMediaService', () => {
  let service: PropertiesRpcMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertiesRpcMediaService],
    }).compile();

    service = module.get<PropertiesRpcMediaService>(PropertiesRpcMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
