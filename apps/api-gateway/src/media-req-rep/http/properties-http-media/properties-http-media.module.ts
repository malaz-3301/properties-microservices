import { Module } from '@nestjs/common';
import { PropertiesHttpMediaService } from './properties-http-media.service';
import { PropertiesHttpMediaController } from './properties-http-media.controller';
import { ImgProMulterModule } from '@malaz/contracts/modules/set/img-pro-multer.module';

@Module({
  imports: [ImgProMulterModule],
  controllers: [PropertiesHttpMediaController],
  providers: [PropertiesHttpMediaService],
})
export class PropertiesHttpMediaModule {}
