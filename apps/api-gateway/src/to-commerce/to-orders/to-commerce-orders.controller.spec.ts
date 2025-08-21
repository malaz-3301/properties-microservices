import { Test, TestingModule } from '@nestjs/testing';
import { ToCommerceOrdersController } from './to-commerce-orders.controller';

describe('ToCommerceOrdersController', () => {
  let controller: ToCommerceOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToCommerceOrdersController],
    }).compile();

    controller = module.get<ToCommerceOrdersController>(ToCommerceOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
