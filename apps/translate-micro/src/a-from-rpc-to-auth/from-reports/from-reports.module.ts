import { Module } from '@nestjs/common';
import { FromReportsController } from './from-reports.controller';
import { TranslateService } from './from-reports.service';

@Module({
  controllers: [FromReportsController],
  providers: [TranslateService],
})
export class FromReportsModule {}
