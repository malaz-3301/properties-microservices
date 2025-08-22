import { Test, TestingModule } from '@nestjs/testing';
import { FromCommerceController } from './from-commerce.controller';
import { FromCommerceService } from './from-commerce.service';

describe('FromCommerceController', () => {
  let controller: FromCommerceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromCommerceController],
      providers: [FromCommerceService],
    }).compile();

    controller = module.get<FromCommerceController>(FromCommerceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
