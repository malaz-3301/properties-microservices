import { Test, TestingModule } from '@nestjs/testing';
import { FromUsersService } from './from-users.service';

describe('FromUsersService', () => {
  let service: FromUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FromUsersService],
    }).compile();

    service = module.get<FromUsersService>(FromUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
