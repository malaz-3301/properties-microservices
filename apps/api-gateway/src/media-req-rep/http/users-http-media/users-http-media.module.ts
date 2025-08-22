import { Module } from '@nestjs/common';
import { UsersHttpMediaService } from './users-http-media.service';
import { UsersHttpMediaController } from './users-http-media.controller';

@Module({
  controllers: [UsersHttpMediaController],
  providers: [UsersHttpMediaService],
})
export class UsersHttpMediaModule {}
