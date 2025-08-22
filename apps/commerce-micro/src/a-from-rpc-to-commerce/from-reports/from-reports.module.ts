import { Module } from '@nestjs/common';
import { FromReportsService } from './from-reports.service';
import { FromReportsController } from './from-reports.controller';

@Module({
  controllers: [FromReportsController],
  providers: [FromReportsService],
})
export class FromReportsModule {}
