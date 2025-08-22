import { Module } from '@nestjs/common';
import { FromUsersService } from './from-users.service';
import { FromUsersController } from './from-users.controller';

@Module({
  controllers: [FromUsersController],
  providers: [FromUsersService],
})
export class FromUsersModule {}
