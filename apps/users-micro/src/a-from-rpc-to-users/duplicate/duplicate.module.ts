import { Module } from '@nestjs/common';
import { DuplicateService } from './duplicate.service';
import { DuplicateController } from './duplicate.controller';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [DuplicateController],
  providers: [DuplicateService],
})
export class DuplicateModule {}
