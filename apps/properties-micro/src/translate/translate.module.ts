import { Module } from '@nestjs/common';

import { PropertiesModule } from '../properties/properties.module';
import { TranslateController } from './translate.controller';
import { TranslateService } from './translate.service';

@Module({
  imports: [PropertiesModule],
  controllers: [TranslateController],
  providers: [TranslateService],
})
export class TranslateModule {}
