import { Module } from '@nestjs/common';
import { PropertiesRpcMediaService } from './properties-rpc-media.service';
import { PropertiesRpcMediaController } from './properties-rpc-media.controller';

@Module({
  controllers: [PropertiesRpcMediaController],
  providers: [PropertiesRpcMediaService],
})
export class PropertiesRpcMediaModule {}
