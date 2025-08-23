import { Test, TestingModule } from '@nestjs/testing';
import { FromCommerceController } from './from-commerce.controller';

describe('FromCommerceController', () => {
  let controller: FromCommerceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromCommerceController],
    }).compile();

    controller = module.get<FromCommerceController>(FromCommerceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
