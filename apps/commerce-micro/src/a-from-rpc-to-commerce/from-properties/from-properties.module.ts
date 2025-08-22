import { Module } from '@nestjs/common';
import { FromPropertiesService } from './from-properties.service';
import { FromPropertiesController } from './from-properties.controller';

@Module({
  controllers: [FromPropertiesController],
  providers: [FromPropertiesService],
})
export class FromPropertiesModule {}
