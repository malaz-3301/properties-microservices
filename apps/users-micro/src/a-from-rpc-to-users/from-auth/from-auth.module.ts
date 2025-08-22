import { Module } from '@nestjs/common';
import { FromAuthService } from './from-auth.service';
import { FromAuthController } from './from-auth.controller';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [FromAuthController],
  providers: [FromAuthService],
})
export class FromAuthModule {}
