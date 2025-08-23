import { Test, TestingModule } from '@nestjs/testing';
import { DuplicateController } from './duplicate.controller';

describe('DuplicateController', () => {
  let controller: DuplicateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DuplicateController],
    }).compile();

    controller = module.get<DuplicateController>(DuplicateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
