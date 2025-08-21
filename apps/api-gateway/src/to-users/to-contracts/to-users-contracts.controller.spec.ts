import { Test, TestingModule } from '@nestjs/testing';
import { ToUsersContractsController } from './to-users-contracts.controller';

describe('ToUsersContractsController', () => {
  let controller: ToUsersContractsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToUsersContractsController],
    }).compile();

    controller = module.get<ToUsersContractsController>(ToUsersContractsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
