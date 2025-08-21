import { Test, TestingModule } from '@nestjs/testing';
import { UsersMicroController } from './users-micro.controller';
import { UsersMicroService } from './users-micro.service';

describe('UsersMicroController', () => {
  let usersMicroController: UsersMicroController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersMicroController],
      providers: [UsersMicroService],
    }).compile();

    usersMicroController = app.get<UsersMicroController>(UsersMicroController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(usersMicroController.getHello()).toBe('Hello World!');
    });
  });
});
