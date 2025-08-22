import { Module } from '@nestjs/common';
import { UsersRpcMediaService } from './users-rpc-media.service';
import { UsersRpcMediaController } from './users-rpc-media.controller';

@Module({
  controllers: [UsersRpcMediaController],
  providers: [UsersRpcMediaService],
})
export class UsersRpcMediaModule {}
