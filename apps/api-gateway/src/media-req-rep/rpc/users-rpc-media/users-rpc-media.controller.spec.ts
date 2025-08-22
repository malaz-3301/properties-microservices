import { Test, TestingModule } from '@nestjs/testing';
import { UsersRpcMediaController } from './users-rpc-media.controller';
import { UsersRpcMediaService } from './users-rpc-media.service';

describe('UsersRpcMediaController', () => {
  let controller: UsersRpcMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersRpcMediaController],
      providers: [UsersRpcMediaService],
    }).compile();

    controller = module.get<UsersRpcMediaController>(UsersRpcMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
