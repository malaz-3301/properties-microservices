import { Module } from '@nestjs/common';
import { TranslateService } from './from-users.service';
import { FromUsersController } from './from-users.controller';

@Module({
  controllers: [FromUsersController],
  providers: [TranslateService],
})
export class FromUsersModule {}
