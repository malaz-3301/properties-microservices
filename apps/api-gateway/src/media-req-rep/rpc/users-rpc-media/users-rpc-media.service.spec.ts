import { Test, TestingModule } from '@nestjs/testing';
import { UsersRpcMediaService } from './users-rpc-media.service';

describe('UsersRpcMediaService', () => {
  let service: UsersRpcMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersRpcMediaService],
    }).compile();

    service = module.get<UsersRpcMediaService>(UsersRpcMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
