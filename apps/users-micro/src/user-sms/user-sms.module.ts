import { Module } from '@nestjs/common';
import { UserSmsService } from './user-sms.service';
import { UserSmsController } from './user-sms.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [UserSmsController],
  providers: [UserSmsService],
})
export class UserSmsModule {}
