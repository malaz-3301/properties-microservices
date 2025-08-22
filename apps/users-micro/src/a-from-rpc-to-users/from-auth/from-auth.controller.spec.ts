import { Test, TestingModule } from '@nestjs/testing';
import { FromAuthController } from './from-auth.controller';
import { FromAuthService } from './from-auth.service';

describe('FromAuthController', () => {
  let controller: FromAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromAuthController],
      providers: [FromAuthService],
    }).compile();

    controller = module.get<FromAuthController>(FromAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
