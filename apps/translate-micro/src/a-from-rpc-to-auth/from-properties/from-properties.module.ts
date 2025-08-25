import { Module } from '@nestjs/common';

import { FromPropertiesController } from './from-properties.controller';
import { TranslateService } from './from-properties.service';

@Module({
  controllers: [FromPropertiesController],
  providers: [TranslateService],
})
export class FromPropertiesModule {}
