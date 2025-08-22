import { Test, TestingModule } from '@nestjs/testing';
import { UsersHttpMediaService } from './users-http-media.service';

describe('UsersHttpMediaService', () => {
  let service: UsersHttpMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersHttpMediaService],
    }).compile();

    service = module.get<UsersHttpMediaService>(UsersHttpMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
