import { Module } from '@nestjs/common';
import { PropertiesHttpMediaService } from './properties-http-media.service';
import { PropertiesHttpMediaController } from './properties-http-media.controller';

@Module({
  controllers: [PropertiesHttpMediaController],
  providers: [PropertiesHttpMediaService],
})
export class PropertiesHttpMediaModule {}
