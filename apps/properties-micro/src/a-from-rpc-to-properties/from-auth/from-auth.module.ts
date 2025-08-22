import { Module } from '@nestjs/common';
import { FromAuthService } from './from-auth.service';
import { FromAuthController } from './from-auth.controller';

@Module({
  controllers: [FromAuthController],
  providers: [FromAuthService],
})
export class FromAuthModule {}
