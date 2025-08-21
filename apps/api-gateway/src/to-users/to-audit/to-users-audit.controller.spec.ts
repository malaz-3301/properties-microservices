import { Test, TestingModule } from '@nestjs/testing';
import { ToUsersAuditController } from './to-users-audit.controller';

describe('ToUsersAuditController', () => {
  let controller: ToUsersAuditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToUsersAuditController],
    }).compile();

    controller = module.get<ToUsersAuditController>(ToUsersAuditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
