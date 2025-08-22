import { Test, TestingModule } from '@nestjs/testing';
import { UsersHttpMediaController } from './users-http-media.controller';
import { UsersHttpMediaService } from './users-http-media.service';

describe('UsersHttpMediaController', () => {
  let controller: UsersHttpMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersHttpMediaController],
      providers: [UsersHttpMediaService],
    }).compile();

    controller = module.get<UsersHttpMediaController>(UsersHttpMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
