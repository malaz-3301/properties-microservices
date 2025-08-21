import { Test, TestingModule } from '@nestjs/testing';
import { AuthMicroController } from './auth-micro.controller';
import { AuthMicroService } from './auth-micro.service';

describe('AuthMicroController', () => {
  let authMicroController: AuthMicroController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthMicroController],
      providers: [AuthMicroService],
    }).compile();

    authMicroController = app.get<AuthMicroController>(AuthMicroController);
  });
});
