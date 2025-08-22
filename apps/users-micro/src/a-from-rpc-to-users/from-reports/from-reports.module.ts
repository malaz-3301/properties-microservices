import { Module } from '@nestjs/common';
import { FromReportsService } from './from-reports.service';
import { FromReportsController } from './from-reports.controller';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [FromReportsController],
  providers: [FromReportsService],
})
export class FromReportsModule {}
