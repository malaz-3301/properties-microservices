import { Test, TestingModule } from '@nestjs/testing';
import { ToUsersAuditService } from './to-users-audit.service';

describe('ToUsersAuditService', () => {
  let service: ToUsersAuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToUsersAuditService],
    }).compile();

    service = module.get<ToUsersAuditService>(ToUsersAuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
